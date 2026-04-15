import type { SalesStatus } from '@shared/types'

export const SALES_STATUS_LABELS: Record<SalesStatus, string> = {
  draft: '草稿',
  pending_approval: '待审批',
  approving: '审批中',
  approved: '已通过',
  pending_payment: '待付款',
  paid: '已付款',
  clearing: '清分中',
  completed: '已完成',
  rejected: '已驳回',
}

export const SALES_STATUS_COLORS: Record<SalesStatus, string> = {
  draft: 'default',
  pending_approval: 'orange',
  approving: 'blue',
  approved: 'green',
  pending_payment: 'orange',
  paid: 'cyan',
  clearing: 'purple',
  completed: 'green',
  rejected: 'red',
}

export const SALES_STATUS_TABS = [
  { key: 'all', title: '全部' },
  { key: 'pending_approval', title: '待审批' },
  { key: 'approving', title: '审批中' },
  { key: 'approved', title: '已通过' },
  { key: 'pending_payment', title: '待付款' },
  { key: 'paid', title: '已付款' },
  { key: 'completed', title: '已完成' },
] as const
