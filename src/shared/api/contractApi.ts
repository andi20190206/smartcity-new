import { get } from './client'
import type { PaginatedResponse, PaginationParams, Contract, ContractStatus } from '@shared/types'

export const contractApi = {
  getList: (params: PaginationParams & { status?: ContractStatus; keyword?: string }) =>
    get<PaginatedResponse<Contract>>('/contract/list', { params }),

  getDetail: (id: string) =>
    get<Contract>(`/contract/${id}`),
}
