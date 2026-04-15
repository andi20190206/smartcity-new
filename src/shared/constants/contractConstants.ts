import type { ContractStatus } from '@shared/types'

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  pending_sign: '待签署',
  signing: '签署中',
  signed: '已签署',
  archived: '已归档',
}

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  pending_sign: 'orange',
  signing: 'blue',
  signed: 'green',
  archived: 'default',
}
