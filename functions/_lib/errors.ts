export type ApiErrorCode = 'bad_request' | 'unknown_slug' | 'method_not_allowed' | 'unsupported_media_type' | 'forbidden' | 'server_error'
  | 'license_required' | 'receipt_invalid' | 'unauthenticated' | 'session_expired'
  | 'forbidden_origin' | 'not_found' | 'slug_taken' | 'pr_limit' | 'too_large'
  | 'unsupported_type' | 'invalid' | 'rate_limited' | 'github_error' | 'submit_disabled'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    public readonly extra: Record<string, unknown> = {},
  ) {
    super(code)
  }
}
