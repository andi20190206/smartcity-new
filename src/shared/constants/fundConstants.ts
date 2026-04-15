import type { AdvanceStatus, WithdrawStatus, DepositChangeAuditStatus } from '@shared/types'

export const ADVANCE_STATUS_LABELS: Record<AdvanceStatus, string> = {
  pending: '待审批',
  approving: '审批中',
  approved: '已通过',
  rejected: '已驳回',
  withdrawn: '已提现',
  withdraw_failed: '提现失败',
}

export const ADVANCE_STATUS_COLORS: Record<AdvanceStatus, string> = {
  pending: 'orange',
  approving: 'blue',
  approved: 'green',
  rejected: 'red',
  withdrawn: 'cyan',
  withdraw_failed: 'red',
}

export const WITHDRAW_STATUS_LABELS: Record<WithdrawStatus, string> = {
  pending: '待提现',
  processing: '处理中',
  success: '已到账',
  failed: '提现失败',
}

export const WITHDRAW_STATUS_COLORS: Record<WithdrawStatus, string> = {
  pending: 'orange',
  processing: 'blue',
  success: 'green',
  failed: 'red',
}

export const DEPOSIT_AUDIT_STATUS_LABELS: Record<DepositChangeAuditStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
}

export const DEPOSIT_AUDIT_STATUS_COLORS: Record<DepositChangeAuditStatus, string> = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
}
