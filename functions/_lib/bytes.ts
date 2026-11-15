// Never substitute a JS byte-by-byte encoder here: large screenshots exhaust Workers CPU.
export function toBase64(bytes: Uint8Array): string {
  const native = (bytes as Uint8Array & { toBase64?: () => string }).toBase64
  if (typeof native === 'function') return native.call(bytes)
  const buffer = (globalThis as typeof globalThis & {
    Buffer?: { from(bytes: Uint8Array): { toString(encoding: string): string } }
  }).Buffer
  if (buffer) return buffer.from(bytes).toString('base64')
  throw new Error('Native base64 unavailable; enable nodejs_compat')
}

export function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function fromBase64(value: string): Uint8Array {
  const native = (Uint8Array as typeof Uint8Array & { fromBase64?: (value: string) => Uint8Array }).fromBase64
  if (typeof native === 'function') return native.call(Uint8Array, value)
  // atob is a native decoder; this copies its output, it is not a JS base64 codec.
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

export function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) throw new Error('Invalid base64url')
  const bytes = fromBase64(value.replace(/-/g, '+').replace(/_/g, '/'))
  // Reject noncanonical padding bits so changing a signature character is always tampering.
  if (toBase64Url(bytes) !== value) throw new Error('Invalid base64url')
  return bytes
}
