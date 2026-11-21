import { byId, groupBy, sourceKey } from './records.mjs'

const rotation = ['cobus', 'grokbotdev', 'botdirectory', 'ronglecat', 'sitin', 'majiayu']
const priority = r => ((r.score ?? -1) + 1) * 4 + Number(!r.needsReview.flag) * 2 + Number(r.cnFit.value === '好')
export function top50(texts) {
  const ranked = []
  for (const [, bucket] of [...groupBy(texts, priority)].sort(([a], [b]) => b - a)) {
    const queues = groupBy(bucket.sort(byId), sourceKey)
    const order = [...rotation, ...[...queues.keys()].filter(k => !rotation.includes(k)).sort()]
    for (let i = 0; i < Math.max(...[...queues.values()].map(q => q.length)); i++) {
      for (const k of order) {
        const row = queues.get(k)?.[i]
        if (!row) continue
        const { id, kind, title, zh, score, rubric, cnFit, needsReview, listed, file, firstTask, expect } = row
        ranked.push({ rank: ranked.length + 1, id, kind, title, zh, score, rubric, cnFit, needsReview, listed, file, firstTask, expect })
        if (ranked.length === 50) return ranked
      }
    }
  }
  return ranked
}
