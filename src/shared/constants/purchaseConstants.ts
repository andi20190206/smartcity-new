import type { PurchaseStatus, CollisionLevel, WaterDamageLevel, FireDamageLevel, VehiclePhotoType } from '@shared/types'

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  pending_internal: '待内审',
  pending_approval: '待审批',
  signed: '已签约',
  rejected: '已驳回',
  cancelled: '已取消',
}

export const PURCHASE_STATUS_COLORS: Record<PurchaseStatus, string> = {
  pending_internal: 'orange',
  pending_approval: 'blue',
  signed: 'green',
  rejected: 'red',
  cancelled: 'default',
}

export const PURCHASE_STATUS_TABS = [
  { key: 'all', title: '全部' },
  { key: 'pending_internal', title: '待内审' },
  { key: 'pending_approval', title: '待审批' },
  { key: 'signed', title: '已签约' },
  { key: 'rejected', title: '已驳回' },
] as const

/** 碰撞等级选项（与Axure原型一致） */
export const COLLISION_OPTIONS: { label: string; value: CollisionLevel }[] = [
  { label: '正常', value: '正常' },
  { label: '损伤覆盖件', value: '损伤覆盖件' },
  { label: '损伤加强件', value: '损伤加强件' },
  { label: '损伤结构件', value: '损伤结构件' },
]

/** 水泡等级选项（与Axure原型一致） */
export const WATER_DAMAGE_OPTIONS: { label: string; value: WaterDamageLevel }[] = [
  { label: '正常', value: '正常' },
  { label: '到座椅底', value: '到座椅底' },
  { label: '超过座垫', value: '超过座垫' },
  { label: '超过中控台', value: '超过中控台' },
  { label: '没顶', value: '没顶' },
]

/** 火烧等级选项（与Axure原型一致） */
export const FIRE_DAMAGE_OPTIONS: { label: string; value: FireDamageLevel }[] = [
  { label: '正常', value: '正常' },
  { label: '轻度', value: '轻度' },
  { label: '中度', value: '中度' },
]

/** 车辆照片类型标签和顺序 */
export const VEHICLE_PHOTO_TYPES: { type: VehiclePhotoType; label: string; required: boolean }[] = [
  { type: 'left_front_45', label: '左前45度', required: true },
  { type: 'dashboard', label: '仪表盘', required: true },
  { type: 'right_rear_45', label: '右后45度', required: true },
  { type: 'left_front_seat', label: '左前排座椅', required: true },
  { type: 'engine_block', label: '发动机缸体', required: true },
  { type: 'nameplate', label: '铭牌', required: true },
  { type: 'other', label: '其它照片', required: false },
]

/** 车主类型选项 */
export const OWNER_TYPE_OPTIONS = [
  { label: '个人', value: '个人' as const },
  { label: '企业', value: '企业' as const },
  { label: '个体工商户', value: '个体工商户' as const },
]

/** 收款人身份选项 */
export const PAYEE_IDENTITY_OPTIONS = [
  { label: '车主', value: '车主' as const },
  { label: '非车主', value: '非车主' as const },
]

/** 个体工商户银行卡类型选项 */
export const SOLE_PROPRIETOR_BANK_CARD_TYPES = [
  { label: '法人名下银行卡', value: '法人名下银行卡' as const },
  { label: '对公账户银行卡', value: '对公账户银行卡' as const },
]

/** 个体工商户账户类型选项（按银行卡类型分组） */
export const SOLE_PROPRIETOR_ACCOUNT_TYPES = {
  '法人名下银行卡': [
    { label: '他行个人账户', value: '他行个人账户' as const },
    { label: '中信个人账户', value: '中信个人账户' as const },
  ],
  '对公账户银行卡': [
    { label: '他行企业账户', value: '他行企业账户' as const },
    { label: '中信企业账户', value: '中信企业账户' as const },
  ],
}

/** 采购表单步骤（改造后2步） */
export const PURCHASE_FORM_STEPS = [
  { index: 0, label: '车辆信息' },
  { index: 1, label: '收款信息' },
] as const
