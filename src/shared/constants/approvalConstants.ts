import type { ApprovalStatus, ApprovalType } from '@shared/types'

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: '待审批',
  approving: '审批中',
  approved: '已通过',
  rejected: '已驳回',
}

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: 'orange',
  approving: 'blue',
  approved: 'green',
  rejected: 'red',
}

export const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  purchase: '采购审批',
  advance: '垫款审批',
  listing: '上架审批',
  sales_sign: '销售签约',
  supervision_release: '监管解除',
  vehicle_use: '用车审批',
  deposit_change: '款项变动',
  alarm_handle: '告警处理',
  wholesale: '批售审批',
}

export const APPROVAL_TYPE_COLORS: Record<ApprovalType, string> = {
  purchase: 'blue',
  advance: 'orange',
  listing: 'purple',
  sales_sign: 'green',
  supervision_release: 'cyan',
  vehicle_use: 'geekblue',
  deposit_change: 'red',
  alarm_handle: 'volcano',
  wholesale: 'default',
}

export const APPROVAL_TABS = [
  { key: 'todo', title: '待我审批' },
  { key: 'initiated', title: '我发起的' },
  { key: 'done', title: '已处理' },
] as const
