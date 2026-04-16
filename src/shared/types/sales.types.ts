// ==========================================
// 销售状态 — 简化后状态流
// 待内审(可选) → 待审批 → 待付款 → 已售
// ==========================================

/** 销售状态 */
export type SalesStatus =
  | 'pending_internal'   // 待内审（店内审批，可选，配置项控制）
  | 'pending_approval'   // 待审批（经销公司审批）
  | 'pending_payment'    // 待付款（审批通过后等待买家付款）
  | 'sold'               // 已售
  | 'rejected'           // 已驳回
  | 'cancelled'          // 已取消

/** 销售模式 */
export type SalesMode = 'single' | 'batch'

export type BuyerType = '企业' | '个人' | '个体工商户'

// ==========================================
// 销售车辆明细
// ==========================================

/** 销售车辆明细 */
export interface SalesVehicleItem {
  id: string
  purchaseOrderId: string
  plateNo: string
  vin: string
  brandModel: string
  engineNo?: string
  useType?: string
  mileage: number
  registerDate?: string
  /** 采购合同价(元) */
  contractPrice: number
  /** 销售价(元) */
  salesPrice: number
  /** 上架信息 */
  retailPrice?: number
  wholesalePrice?: number
  inspectionReport?: string
  listed: boolean
}

// ==========================================
// 买家信息
// ==========================================

/** 买家信息 */
export interface BuyerInfo {
  /** 身份证照片（人像面+国徽面） */
  idCardPhotos: string[]
  buyerName: string
  idNo: string
  buyerPhone: string
  /** 收款银行卡照片 */
  bankCardPhoto: string
  bankCardNo: string
  bankName: string
}

// ==========================================
// 销售单主表
// ==========================================

/** 销售单 */
export interface SalesOrder {
  id: string
  mode: SalesMode
  status: SalesStatus
  statusText: string
  createTime: string
  /** 车辆销售明细（单车=1台，批量=N台同一买家） */
  vehicles: SalesVehicleItem[]
  /** 买家信息 */
  buyer: BuyerInfo
  /** 签名 */
  salesAdvisorSign?: string
  buyerSign?: string
  /** 金额汇总（元） */
  totalContractPrice: number
  totalSalesPrice: number
  /** 销售顾问 */
  salesAdvisor: string
  storeName: string
  companyName: string
  /** 驳回原因 */
  rejectReason?: string
}
