import { get, post } from './client'
import type {
  PaginatedResponse,
  PaginationParams,
  ApprovalRecord,
  ApprovalType,
  ApprovalStatus,
  BatchApprovalRequest,
  BatchApprovalResult,
  ApprovalFlowConfig,
} from '@shared/types'

export interface ApprovalListParams extends PaginationParams {
  tab: 'todo' | 'initiated' | 'done'
  type?: ApprovalType
  status?: ApprovalStatus
  keyword?: string
}

export const approvalApi = {
  getList: (params: ApprovalListParams) =>
    get<PaginatedResponse<ApprovalRecord>>('/approval/list', { params }),

  getDetail: (id: string) =>
    get<ApprovalRecord>(`/approval/${id}`),

  approve: (id: string, opinion: string) =>
    post<void>(`/approval/${id}/approve`, { opinion }),

  reject: (id: string, opinion: string) =>
    post<void>(`/approval/${id}/reject`, { opinion }),

  transfer: (id: string, toUserId: string) =>
    post<void>(`/approval/${id}/transfer`, { toUserId }),

  /** 批量审批 */
  batchApprove: (data: BatchApprovalRequest) =>
    post<BatchApprovalResult>('/approval/batch', data),

  /** 审批流配置 */
  getFlowConfigs: (companyId?: string) =>
    get<ApprovalFlowConfig[]>('/approval/flow-configs', { params: { companyId } }),

  updateFlowConfig: (data: ApprovalFlowConfig) =>
    post<void>('/approval/flow-config', data),
}
