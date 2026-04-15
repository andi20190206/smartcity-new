export type ContractStatus = 'pending_sign' | 'signing' | 'signed' | 'archived'
export type ContractType = '采购合同' | '销售合同' | '批售合同'
export type ContractApprovalStatus = '审批中' | '通过/不通过' | '待审批'

/** 合同关联车辆 */
export interface ContractVehicleItem {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  contractPrice: number
  insurance?: string
  mileage?: number
  registerDate?: string
  annualInspection?: string
  color?: string
  transferCount?: number
  condition?: string
  /** 车300估价信息 */
  thirdPartyPrice?: number | null
  thirdPartyPriceFair?: number | null
  thirdPartyPricePoor?: number | null
  newCarGuidePrice?: number | null
  vehicleAge?: string
}

/** 合同签署方 */
export interface ContractParty {
  role: string
  name: string
  idNo?: string
  phone?: string
  signed: boolean
  signTime?: string
  delegated?: boolean
  delegateName?: string
  delegateProof?: string
}

/** 车主信息 */
export interface ContractOwnerInfo {
  ownerType: '个人' | '企业' | '个体工商户'
  ownerName: string
  idNo: string
  phone: string
}

/** 收款信息 */
export interface ContractPayeeInfo {
  payeeIdentity: '车主' | '非车主'
  payeeName: string
  payeeIdNo: string
  payeePhone: string
  payeeBank: string
  payeeCardNo: string
}

/** 交车信息 */
export interface ContractDeliveryInfo {
  deliveryDate: string
  deliveryLocation: string
}

/** 合同主表 */
export interface Contract {
  id: string
  contractType: ContractType
  status: ContractStatus
  statusText: string
  createTime: string
  signTime?: string
  bizOrderId: string
  parties: ContractParty[]
  vehicles: ContractVehicleItem[]
  totalAmount: number
  vehicleCount: number
  hasAttachment: boolean
  offlineUpload: boolean
  dealerCompany: string
  applicant?: string
  storeName?: string
  groupName?: string
  salesperson?: string
  approvalStatus?: ContractApprovalStatus
  approvalNode?: string
  approver?: string
  inTransitQuota?: number
  maxQuota?: number
  availableQuota?: number
  ownerInfo?: ContractOwnerInfo
  payeeInfo?: ContractPayeeInfo
  deliveryInfo?: ContractDeliveryInfo
}
