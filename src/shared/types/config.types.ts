/** 配置级别 */
export type ConfigLevel = 'platform' | 'dealer_company' | 'store'

/** 配置项值类型 */
export type ConfigValueType = 'select' | 'multi_select' | 'number' | 'percentage' | 'toggle' | 'threshold'

/** 单个配置项 */
export interface ConfigItem {
  id: string
  name: string
  key: string
  group: string
  description: string
  level: ConfigLevel
  valueType: ConfigValueType
  value: string | number | boolean | string[]
  defaultValue: string | number | boolean | string[]
  options?: { label: string; value: string }[]
  range?: { min: number; max: number; step: number; unit: string }
  overridden?: boolean
}

/** 配置变更记录 */
export interface ConfigChangeLog {
  id: string
  configKey: string
  configName: string
  oldValue: string
  newValue: string
  operator: string
  operatorRole: string
  level: ConfigLevel
  companyName?: string
  changeTime: string
}

/** 经销公司配置覆盖 */
export interface CompanyConfigOverride {
  companyId: string
  companyName: string
  overrideCount: number
  lastUpdateTime: string
}

/** 签注机构 */
export interface EndorsementInstitution {
  id: string
  name: string
  province: string
  city: string
  district: string
  addressDetail: string
  contact: string
  phone: string
  createTime: string
}
