import { get, post } from './client'
import type {
  PaginatedResponse,
  PaginationParams,
  DealerQuota,
  AdvanceRecord,
  AdvanceStatus,
  DepositChangeRecord,
  InTransitDetail,
} from '@shared/types'

export const fundApi = {
  getQuota: (dealerId: string) =>
    get<DealerQuota>(`/fund/quota/${dealerId}`),

  getAdvanceList: (params: PaginationParams & { status?: AdvanceStatus }) =>
    get<PaginatedResponse<AdvanceRecord>>('/fund/advance/list', { params }),

  getAdvanceDetail: (id: string) =>
    get<AdvanceRecord>(`/fund/advance/${id}`),

  createAdvance: (data: Partial<AdvanceRecord>) =>
    post<AdvanceRecord>('/fund/advance/create', data),

  getDepositChanges: (params: PaginationParams) =>
    get<PaginatedResponse<DepositChangeRecord>>('/fund/deposit-changes', { params }),

  getInTransitDetails: (dealerId: string) =>
    get<InTransitDetail[]>(`/fund/in-transit/${dealerId}`),
}
