import { get, post } from './client'
import type { ConfigItem, ConfigChangeLog, CompanyConfigOverride, EndorsementInstitution } from '@shared/types'
import type { PaginatedResponse, PaginationParams } from '@shared/types'

export const configApi = {
  getConfigs: (group?: string) =>
    get<ConfigItem[]>('/config/list', { params: { group } }),

  updateConfig: (id: string, value: ConfigItem['value']) =>
    post<void>(`/config/${id}`, { value }),

  getChangeLogs: (params: PaginationParams) =>
    get<PaginatedResponse<ConfigChangeLog>>('/config/logs', { params }),

  getCompanyOverrides: () =>
    get<CompanyConfigOverride[]>('/config/company-overrides'),

  getEndorsementInstitutions: () =>
    get<EndorsementInstitution[]>('/config/endorsement-institutions'),
}
