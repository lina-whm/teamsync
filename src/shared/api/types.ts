export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
