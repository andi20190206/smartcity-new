import type { SalesStatus } from '@shared/types'

export const SALES_STATUS_LABELS: Record<SalesStatus, string> = {
  pending_internal: '待内审',
  pending_approval: '待审批',
  pending_payment: '待付款',
  sold: '已售',
  rejected: '已驳回',
  cancelled: '已取消',
}

export const SALES_STATUS_COLORS: Record<SalesStatus, { bg: string; color: string }> = {
  pending_internal: { bg: '#FFF3E0', color: '#F57C00' },
  pending_approval: { bg: '#E3F2FD', color: '#1976D2' },
  pending_payment: { bg: '#FFF3E0', color: '#F57C00' },
  sold: { bg: '#E8F5E9', color: '#388E3C' },
  rejected: { bg: '#FFEBEE', color: '#D32F2F' },
  cancelled: { bg: '#F5F5F5', color: '#9E9E9E' },
}

export const SALES_STATUS_TABS = [
  { key: 'all', title: '全部' },
  { key: 'pending_internal', title: '待内审' },
  { key: 'pending_approval', title: '待审批' },
  { key: 'pending_payment', title: '待付款' },
  { key: 'sold', title: '已售' },
  { key: 'rejected', title: '已驳回' },
] as const

/** 销售签约流程步骤 */
export const SALES_FLOW_STEPS = [
  { index: 0, label: '合同填写' },
  { index: 1, label: '合同审批' },
  { index: 2, label: '买家付款' },
  { index: 3, label: '完成' },
] as const
