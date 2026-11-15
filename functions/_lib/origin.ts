import { ApiError } from './errors'

type HeaderRequest = Pick<Request, 'headers' | 'url'>

// Origin comparison is shared; Fetch Metadata policy differs for legacy clicks.
export function isSameOrigin(request: HeaderRequest): boolean {
  const origin = request.headers.get('Origin')
  return origin === null || origin === new URL(request.url).origin
}

export function mediaType(request: Pick<Request, 'headers'>): string | null {
  return request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() || null
}

export function assertSameOrigin(request: HeaderRequest): void {
  const site = request.headers.get('Sec-Fetch-Site')
  if (!isSameOrigin(request) || (site !== null && site.toLowerCase() !== 'same-origin')) {
    throw new ApiError(403, 'forbidden_origin')
  }
}

export function assertMediaType(request: Pick<Request, 'headers'>, allowed: string[]): void {
  const type = mediaType(request)
  if (type === null || !allowed.includes(type)) throw new ApiError(415, 'unsupported_type')
}
