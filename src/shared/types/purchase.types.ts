// ==========================================
// 采购状态 — 改造后状态流
// 待内审(可选) → 待审批 → 已签约
// ==========================================

/** 采购状态 */
export type PurchaseStatus =
  | 'pending_internal'   // 待内审（店内审批，可选，由配置项控制）
  | 'pending_approval'   // 待审批（经销公司审批）
  | 'signed'             // 已签约
  | 'rejected'           // 已驳回
  | 'cancelled'          // 已取消

/** 采购模式 */
export type PurchaseMode = 'single' | 'batch'

// ==========================================
// 车主/收款人类型体系
// ==========================================

/** 车主类型 */
export type OwnerType = '个人' | '企业' | '个体工商户'

/** 收款人身份 */
export type PayeeIdentity = '车主' | '非车主'

/** 企业证件类型 */
export type EnterpriseCertType = '统一社会信用代码' | '组织机构代码'

/** 个体工商户银行卡类型 */
export type SoleProprietorBankCardType = '法人名下银行卡' | '对公账户银行卡'

/** 个体工商户账户类型 */
export type SoleProprietorAccountType = '他行个人账户' | '中信个人账户' | '他行企业账户' | '中信企业账户'

// ==========================================
// 车况信息（合并到Step1）
// ==========================================

/** 碰撞等级 */
export type CollisionLevel =
  | '正常'
  | '损伤覆盖件'
  | '损伤加强件'
  | '损伤结构件'

/** 水泡等级 */
export type WaterDamageLevel = '正常' | '到座椅底' | '超过座垫' | '超过中控台' | '没顶'

/** 火烧等级 */
export type FireDamageLevel = '正常' | '轻度' | '中度'

/** 车辆照片类型 */
export type VehiclePhotoType =
  | 'left_front_45'     // 左前45度
  | 'dashboard'         // 仪表盘
  | 'right_rear_45'     // 右后45度
  | 'left_front_seat'   // 左前排座椅
  | 'engine_block'      // 发动机缸体
  | 'nameplate'         // 铭牌
  | 'other'             // 其它照片

/** 车辆照片 */
export interface VehiclePhoto {
  type: VehiclePhotoType
  url: string
}

// ==========================================
// 车辆明细（每台车 = 基础信息 + 车况）
// ==========================================

/** 车辆明细（Step1中每台车的完整信息） */
export interface VehicleItem {
  id: string
  // === 基础信息（行驶证OCR获取） ===
  /** 行驶证照片（主页+副页） */
  drivingLicensePhotos: string[]
  /** 登记证照片（1-4页） */
  registrationCertPhotos: string[]
  plateNo: string
  vin: string
  brandModel: string
  engineNo: string
  useType: string
  mileage: number
  registerDate: string
  annualInspection: string
  color: string
  transferCount: number
  /** 里程表状态 */
  odometerStatus: '正常' | '故障'

  // === 车况信息（原Step2，合并到Step1） ===
  /** 车辆照片（6张必传+其它） */
  photos: VehiclePhoto[]
  /** 碰撞等级 */
  collision: CollisionLevel
  /** 水泡等级 */
  waterDamage: WaterDamageLevel
  /** 火烧等级 */
  fireDamage: FireDamageLevel
  /** 车况描述（限200字） */
  conditionDesc?: string
  /** 维保报告 */
  maintenanceReport: '有' | '无'
  /** 维保报告图片 */
  maintenanceReportPhotos?: string[]
  /** 采购价格（元）— 车商自己填，审批时可驳回 */
  purchasePrice: number
  /** 交车时间 */
  deliveryTime: string
  /** 交车地点（默认车商仓库地址，可选） */
  deliveryLocation: string

  /** 车300精准定价（审批时展示，API实时获取） */
  che300Price?: Che300PriceInfo

  /** 批量采购时的图片补充状态 */
  photoProgress?: number
  photoTotal?: number
  photoCompleted?: boolean
}

/** 车300精准定价信息 */
export interface Che300PriceInfo {
  status: 'pending' | 'priced' | 'no_price' | 'error'
  suggestedPrice?: number
  priceGood?: number
  priceFair?: number
  pricePoor?: number
  newCarGuidePrice?: number
  vehicleAge?: string
  pricedAt?: string
  errorMsg?: string
}

// ==========================================
// 车主信息（按类型区分字段）
// ==========================================

/** 个人车主信息 */
export interface IndividualOwnerInfo {
  ownerType: '个人'
  ownerName: string
  idNo: string
  phone: string
  /** 身份证正反面 */
  idPhotos: string[]
}

/** 企业车主信息 */
export interface EnterpriseOwnerInfo {
  ownerType: '企业'
  companyName: string
  certType: EnterpriseCertType
  certNo: string
  phone: string
  /** 营业执照 */
  businessLicensePhoto: string
}

/** 个体工商户车主信息 */
export interface SoleProprietorOwnerInfo {
  ownerType: '个体工商户'
  businessName: string
  certNo: string
  legalRepName: string
  legalRepIdNo: string
  phone: string
  /** 法人身份证正反面 */
  legalRepIdPhotos: string[]
  /** 营业执照 */
  businessLicensePhoto: string
}

/** 车主信息（联合类型） */
export type OwnerInfo = IndividualOwnerInfo | EnterpriseOwnerInfo | SoleProprietorOwnerInfo

// ==========================================
// 收款信息（按车主类型 + 收款人身份区分）
// ==========================================

/** 个人收款信息 */
export interface IndividualPaymentInfo {
  ownerType: '个人'
  payeeIdentity: PayeeIdentity
  payeeName: string        // 车主时自动带入，非车主时手动填
  bankCardNo: string
  bankName: string
  reservedPhone: string
}

/** 企业收款信息 */
export interface EnterprisePaymentInfo {
  ownerType: '企业'
  payeeIdentity: PayeeIdentity
  payeeName: string        // 车主时=企业名称，非车主时手动填
  corporateAccount: string // 对公账号
  bankName: string
}

/** 个体工商户收款信息 */
export interface SoleProprietorPaymentInfo {
  ownerType: '个体工商户'
  payeeIdentity: PayeeIdentity
  payeeName: string
  bankCardType: SoleProprietorBankCardType
  accountType: SoleProprietorAccountType
  bankCardNo: string
  bankName: string
  /** 银行卡正反面 */
  bankCardPhotos?: string[]
  /** 预留手机（仅法人名下银行卡时需要） */
  reservedPhone?: string
}

/** 收款信息（联合类型） */
export type PaymentInfo = IndividualPaymentInfo | EnterprisePaymentInfo | SoleProprietorPaymentInfo

// ==========================================
// 中信银行电子钱包（唯车城端校验创建）
// ==========================================

/** 中信银行电子钱包信息 */
export interface EWalletInfo {
  status: 'pending' | 'created' | 'failed'
  walletAccount?: string
  createdAt?: string
  failReason?: string
}

// ==========================================
// 采购单主表
// ==========================================

/** 采购单 */
export interface PurchaseOrder {
  id: string
  mode: PurchaseMode
  status: PurchaseStatus
  statusText: string
  createTime: string

  /** 车辆明细列表（单车=1台，批量=N台，每台含独立车况） */
  vehicles: VehicleItem[]

  /** 车主信息 */
  ownerInfo: OwnerInfo

  /** 收款信息 */
  paymentInfo: PaymentInfo

  /** 签名图片 */
  signatureUrl?: string

  /** 电子钱包（唯车城端创建） */
  eWallet?: EWalletInfo

  /** 合同号 */
  contractNo?: string

  /** 总价汇总（元） */
  totalPrice: number

  /** 批量采购：图片补充进度 */
  photoStatus?: '未开始' | '补充中' | '已完成'

  /** 发起人 */
  applicant: string
  storeName: string
  companyName: string
}

// ==========================================
// 批量导入
// ==========================================

/** 批量导入行 */
export interface ImportRow {
  plateNo: string
  vin: string
  brandModel: string
  mileage: string
  price: string
  status: 'success' | 'error'
  errorMsg?: string
}

/** 批量导入结果 */
export interface BatchImportResult {
  totalCount: number
  successCount: number
  errorCount: number
  rows: ImportRow[]
}
