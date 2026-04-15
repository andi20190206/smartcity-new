import { get, post } from './client'
import type { PaginatedResponse, PaginationParams, SalesOrder, SalesStatus } from '@shared/types'

export interface SalesListParams extends PaginationParams {
  status?: SalesStatus | 'all'
  keyword?: string
}

export const salesApi = {
  getList: (params: SalesListParams) =>
    get<PaginatedResponse<SalesOrder>>('/sales/list', { params }),

  getDetail: (id: string) =>
    get<SalesOrder>(`/sales/${id}`),

  create: (data: Partial<SalesOrder>) =>
    post<SalesOrder>('/sales/create', data),
}
