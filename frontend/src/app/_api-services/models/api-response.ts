export interface ApiResponse<T> {
  items:T[]
  total: number,
  page: number,
  size: number
}
