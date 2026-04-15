/** 通用API响应 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 批量操作结果 */
export interface BatchResult<T = string> {
  successItems: T[]
  failedItems: { item: T; reason: string }[]
}

/** 通用选项 */
export interface Option<V = string> {
  label: string
  value: V
}
