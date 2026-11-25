import type { D1Database } from '@cloudflare/workers-types'
import { DAY_MS, hashIp, isValidSlug } from './clicks'
import { ApiError } from './errors'
import { EVENTS, EVENT_LIMITS, EVENT_RETENTION_DAYS, PAGE_TYPES, QUERY_EVENTS, QUERY_RETENTION_DAYS, type EventName, type PropSpec } from './events'
import { hit, RATE_LIMITS } from './ratelimit'

const badRequest = () => new ApiError(400, 'bad_request')
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)

export async function readEventBatch(request: Pick<Request, 'headers' | 'body'>) {
  if (!request.body || Number(request.headers.get('Content-Length')) > EVENT_LIMITS.bodyBytes) throw badRequest()
  const reader = request.body.getReader()
  try {
    const decoder = new TextDecoder()
    let bytes = 0, text = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > EVENT_LIMITS.bodyBytes) {
        await reader.cancel()
        throw badRequest()
      }
      text += decoder.decode(value, { stream: true })
    }
    const batch: unknown = JSON.parse(text + decoder.decode())
    if (!record(batch) || batch.v !== 1 || typeof batch.sid !== 'string' || !/^[A-Za-z0-9_-]{16,32}$/.test(batch.sid)
      || !Array.isArray(batch.events) || !batch.events.length || batch.events.length > EVENT_LIMITS.perBatch) throw badRequest()
    return { sid: batch.sid, device: batch.device === 'mobile' || batch.device === 'desktop' ? batch.device : 'unknown', events: batch.events as unknown[] }
  } catch {
    throw badRequest()
  } finally {
    reader.releaseLock()
  }
}

const beijingDay = (at: number) => new Date(at + 8 * 3600_000).toISOString().slice(0, 10)

function prefix(value: string, max: number) {
  return Array.from(value.slice(0, max * 2)).slice(0, max).join('')
}

function cleanProps(name: EventName, raw: unknown) {
  const props: Record<string, string | number | boolean> = {}
  if (!record(raw)) return '{}'
  const specs: Record<string, PropSpec> = EVENTS[name]
  for (const [key, spec] of Object.entries(specs)) {
    if (!Object.hasOwn(raw, key)) continue
    const value = raw[key]
    switch (spec.type) {
      case 'bool': if (typeof value === 'boolean') props[key] = value; break
      case 'enum': if (typeof value === 'string' && spec.values.includes(value)) props[key] = value; break
      case 'int': if (typeof value === 'number' && Number.isInteger(value) && value >= spec.min && value <= spec.max) props[key] = value; break
      case 'str': {
        if (typeof value !== 'string') break
        const query = key === 'q' && (name === 'search' || name === 'library_search')
        let text = prefix(value, query ? 200 : spec.max * 4)
        if (query) text = text.normalize('NFKC')
        text = text.replace(/\p{Cc}/gu, '').trim().replace(/\s+/gu, ' ')
        if (query) text = text.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '【邮箱】').replace(/\d(?:[ -]*\d){6,}/g, '【数字】')
        if (text) props[key] = [...text].slice(0, spec.max).join('')
      }
    }
  }
  return JSON.stringify(props)
}

export async function ingestEvents({ db, salt, ip, ua, country, batch, now }: {
  db: D1Database; salt: string; ip: string; ua: string; country: unknown; batch: Awaited<ReturnType<typeof readEventBatch>>; now: number
}) {
  const insert = db.prepare('INSERT INTO events (at,day,name,page,path,slug,sid,vid,device,country,props) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
  const statements = [], visitors = new Map<string, string>()
  for (const event of batch.events) {
    if (!record(event) || typeof event.name !== 'string' || !Object.hasOwn(EVENTS, event.name)
      || typeof event.path !== 'string' || !event.path.startsWith('/') || [...event.path].length > EVENT_LIMITS.pathMax) continue
    const ago = typeof event.ago === 'number' && Number.isInteger(event.ago) ? Math.min(EVENT_LIMITS.agoMaxMs, Math.max(0, event.ago)) : 0
    const at = now - ago, day = beijingDay(at)
    if (!visitors.has(day)) visitors.set(day, (await hashIp(salt, ip, 'v|' + day + '|' + ua)).slice(0, 16))
    const page = typeof event.page === 'string' && (PAGE_TYPES as readonly string[]).includes(event.page) ? event.page : 'other'
    statements.push(insert.bind(at, day, event.name, page, event.path.split(/[?#]/, 1)[0], isValidSlug(event.slug) ? event.slug : null,
      batch.sid, visitors.get(day)!, batch.device, typeof country === 'string' && /^[A-Z]{2}$/.test(country) ? country : null,
      cleanProps(event.name as EventName, event.props)))
  }
  const bytes = statements.length
  if (!bytes) return
  const key = await hashIp(salt, ip, 'events')
  if (!(await hit(db, { bucket: 'events', key, bytes, ...RATE_LIMITS.events }, now)).ok) return
  if (!(await hit(db, { bucket: 'events-day', key: 'all', bytes, ...RATE_LIMITS['events-day'] }, now)).ok) return
  await db.batch(statements)
}

export function scheduleEventCleanup(db: D1Database, now: number, waitUntil: (p: Promise<unknown>) => void, random = Math.random) {
  if (random() >= 1 / 200) return
  waitUntil(Promise.resolve().then(() => db.batch([
    db.prepare('DELETE FROM events WHERE day < ?').bind(beijingDay(now - EVENT_RETENTION_DAYS * DAY_MS)),
    db.prepare(`UPDATE events SET props = json_remove(props, '$.q')
      WHERE day < ?1 AND name IN (${QUERY_EVENTS.map((_, i) => `?${i + 2}`).join(', ')}) AND json_extract(props, '$.q') IS NOT NULL`)
      .bind(beijingDay(now - QUERY_RETENTION_DAYS * DAY_MS), ...QUERY_EVENTS),
  ])).catch(() => {}))
}
