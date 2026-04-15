import { get } from './client'
import type { PaginatedResponse, PaginationParams, DealerCompany, Store, Dealer } from '@shared/types'

export const tenantApi = {
  getCompanies: (params: PaginationParams & { keyword?: string }) =>
    get<PaginatedResponse<DealerCompany>>('/tenant/companies', { params }),

  getCompanyDetail: (id: string) =>
    get<DealerCompany>(`/tenant/company/${id}`),

  getStores: (companyId: string) =>
    get<Store[]>(`/tenant/company/${companyId}/stores`),

  getDealers: (companyId: string) =>
    get<Dealer[]>(`/tenant/company/${companyId}/dealers`),
}
