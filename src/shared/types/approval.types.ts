/** 审批类型 */
export type ApprovalType =
  | 'purchase'             // 采购审批（含车300定价展示）
  | 'advance'              // 垫款审批
  | 'listing'              // 上架审批
  | 'sales_sign'           // 销售签约审批
  | 'supervision_release'  // 监管解除审批
  | 'vehicle_use'          // 用车审批
  | 'deposit_change'       // 合作款项变动审核
  | 'alarm_handle'         // 告警处理审批
  | 'wholesale'            // 批售审批

/** 审批状态 */
export type ApprovalStatus = 'pending' | 'approving' | 'approved' | 'rejected'

/** 审批节点记录 */
export interface ApprovalNode {
  nodeIndex: number
  nodeName: string
  approverName: string
  approverRole: string
  status: ApprovalStatus
  opinion?: string
  time?: string
}

/** 采购车辆定价信息（展示车300精准定价） */
export interface VehiclePricingInfo {
  plateNo: string
  brandModel: string
  vin: string
  /** 采购价（万） */
  purchasePrice: number
  /** 车300建议采购价（万），null表示未获取到 */
  suggestedPrice: number | null
  /** 定价状态 */
  pricingStatus: 'priced' | 'no_price' | 'pending'
  /** 定价偏差率（%） */
  deviationRate?: number
  /** 车300详细定价 */
  priceGood?: number
  priceFair?: number
  pricePoor?: number
}

/** 门店授信额度信息 */
export interface DealerCreditInfo {
  storeName: string
  maxQuota: number
  inTransitQuota: number
  availableQuota: number
  applyableQuota: number
  currentPurchaseAmount: number
}

/** 审批单 */
export interface ApprovalRecord {
  id: string
  type: ApprovalType
  typeText: string
  bizOrderId: string
  summary: string
  applicant: string
  applicantRole: string
  dealerCompany: string
  currentNode: number
  totalNodes: number
  currentNodeName: string
  status: ApprovalStatus
  statusText: string
  nodes: ApprovalNode[]
  amount?: number
  plateNo?: string
  brandModel?: string
  createTime: string
  updateTime: string
  /** 采购审批专用 */
  vehiclePricingList?: VehiclePricingInfo[]
  dealerCredit?: DealerCreditInfo
  purchaseMode?: 'single' | 'batch'
  /** 垫款审批专用 */
  advanceDetail?: AdvanceApprovalDetail
}

/** 垫款审批详情 */
export interface AdvanceApprovalDetail {
  plateNo: string
  brandModel: string
  vin: string
  registerDate: string
  condition: string
  vehicleStatus: string
  warehouseInfo: string
  transferStatus: string
  paymentType: string
  contractPrice: number
  applyAdvance: number
  regionTotalAdvance?: string
  dealPrice: number
  sellerName: string
  sellerBank: string
  sellerCardNo: string
  sellerPhone?: string
  pendingAdvance: number
  applyableQuota: number
  availableDeposit: number
  availableQuota: number
}

// ==========================================
// 批量审批
// ==========================================

/** 批量审批请求 */
export interface BatchApprovalRequest {
  approvalIds: string[]
  action: 'approve' | 'reject'
  opinion: string
}

/** 批量审批结果 */
export interface BatchApprovalResult {
  successIds: string[]
  failedItems: { id: string; reason: string }[]
}

/** 审批流配置 */
export interface ApprovalFlowConfig {
  id: string
  type: ApprovalType
  typeText: string
  companyId: string
  companyName: string
  nodes: ApprovalFlowNode[]
}

/** 审批流节点配置 */
export interface ApprovalFlowNode {
  nodeIndex: number
  nodeName: string
  approverType: 'role' | 'user'
  approverRole?: string
  approverName?: string
}
