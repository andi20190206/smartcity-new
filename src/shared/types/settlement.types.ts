export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed'

/** 清分车辆明细 */
export interface SettlementVehicleItem {
  id: string
  vin: string
  plateNo: string
  brandModel: string
  contractPrice: number
  salesPrice: number
  profitLoss: number
  serviceFee: number
  commission: number
  advanceRepay: number
  profit: number
  interest: number
}

/** 四路到账状态 */
export interface FourWayStatus {
  platformFee: 'pending' | 'success' | 'failed'
  dealerCommission: 'pending' | 'success' | 'failed'
  companyPayment: 'pending' | 'success' | 'failed'
  bankInterest: 'pending' | 'success' | 'failed' | 'none'
}

/** 清分单主表 */
export interface SettlementOrder {
  id: string
  salesOrderId: string
  status: SettlementStatus
  statusText: string
  createTime: string
  settleTime?: string
  vehicleCount: number
  totalSalesAmount: number
  totalServiceFee: number
  totalCommission: number
  totalCompanyPayment: number
  totalInterest: number
  totalProfitLoss: number
  vehicles: SettlementVehicleItem[]
  fourWayStatus: FourWayStatus
  dealerName: string
  companyName: string
  fundSource: '经销公司自有' | '银行出资'
  retryCount?: number
  failReason?: string
}
