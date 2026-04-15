import { get, post } from './client'
import type { PaginatedResponse, PaginationParams, SettlementOrder, SettlementStatus } from '@shared/types'

export const settlementApi = {
  getList: (params: PaginationParams & { status?: SettlementStatus }) =>
    get<PaginatedResponse<SettlementOrder>>('/settlement/list', { params }),

  getDetail: (id: string) =>
    get<SettlementOrder>(`/settlement/${id}`),

  retry: (id: string) =>
    post<void>(`/settlement/${id}/retry`),
}
