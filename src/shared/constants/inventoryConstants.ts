import type { StockStatus, SalesFlowStatus, SupervisionStatus, AlertLevel, AlertStatus } from '@shared/types'

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  pending_in: '待入库',
  in_stock: '在库',
  out_stock: '出库',
  transferred: '已转移',
}

export const STOCK_STATUS_COLORS: Record<StockStatus, string> = {
  pending_in: 'orange',
  in_stock: 'green',
  out_stock: 'blue',
  transferred: 'default',
}

export const SALES_FLOW_STATUS_LABELS: Record<SalesFlowStatus, string> = {
  pending_in: '待入库',
  pending_listing: '待上架',
  on_sale: '在售',
  in_transaction: '交易中',
  sold: '已售',
}

export const SUPERVISION_STATUS_LABELS: Record<SupervisionStatus, string> = {
  pending: '待监管',
  supervising: '监管中',
  released: '已解除',
}

export const ALERT_LEVEL_LABELS: Record<AlertLevel, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export const ALERT_LEVEL_COLORS: Record<AlertLevel, string> = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  alerting: '告警中',
  ended: '已结束',
  processing: '处理中',
}

/** 库龄预警阈值（天） */
export const STOCK_AGE_THRESHOLDS = [30, 45, 60] as const

export const STOCK_STATUS_TABS = [
  { key: 'all', title: '全部' },
  { key: 'pending_in', title: '待入库' },
  { key: 'in_stock', title: '在库' },
  { key: 'out_stock', title: '出库' },
] as const
