export type ApiErrorCode = 'bad_request' | 'unknown_slug' | 'method_not_allowed' | 'unsupported_media_type' | 'forbidden' | 'server_error'

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: ApiErrorCode) {
    super(code)
  }
}
