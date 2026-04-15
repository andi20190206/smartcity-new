import type { SettlementStatus } from '@shared/types'

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: '待清分',
  processing: '清分中',
  completed: '已完成',
  failed: '清分失败',
}

export const SETTLEMENT_STATUS_COLORS: Record<SettlementStatus, string> = {
  pending: 'orange',
  processing: 'blue',
  completed: 'green',
  failed: 'red',
}
