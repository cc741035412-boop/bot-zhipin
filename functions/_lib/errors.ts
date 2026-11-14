export type ApiErrorCode = 'bad_request' | 'unknown_slug' | 'method_not_allowed' | 'server_error'

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: ApiErrorCode) {
    super(code)
  }
}
