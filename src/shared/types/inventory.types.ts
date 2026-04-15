import type { SupervisionMode, EntryExitMethod } from './supervision.types'
import type { DeviceType } from './device.types'

/** 库存状态 */
export type StockStatus = 'pending_in' | 'in_stock' | 'out_stock' | 'transferred'

/** 销售流程状态 */
export type SalesFlowStatus = 'pending_in' | 'pending_listing' | 'on_sale' | 'in_transaction' | 'sold'

/** 监管状态 */
export type SupervisionStatus = 'pending' | 'supervising' | 'released'

/** 签注状态 */
export type RegistrationStatus = 'pending' | 'registered'

/** 设备在线状态 */
export type DeviceOnlineStatus = 'online' | 'offline'

/** 告警等级 */
export type AlertLevel = 'high' | 'medium' | 'low'

/** 告警状态 */
export type AlertStatus = 'alerting' | 'ended' | 'processing'

/** 用车类型 */
export type VehicleUseType = '试乘试驾' | '展示出库' | '维修保养' | '客户看车'

/** 用车状态 */
export type VehicleUseStatus = 'using' | 'completed' | 'expired' | 'pending_approval' | 'rejected'

/** 盘点类型 */
export type InventoryCheckType = 'gps_auto' | 'manual'

/** 盘点状态 */
export type InventoryCheckStatus = 'checking' | 'finished'

// ==========================================
// 车辆设备绑定（多设备支持）
// ==========================================

/** 车辆级设备绑定 */
export interface VehicleDeviceBinding {
  deviceNo: string
  deviceType: DeviceType
  online: DeviceOnlineStatus
  lastHeartbeat?: string
}

/** 仓库级设备信息（固定场所监管时引用） */
export interface WarehouseDeviceInfo {
  warehouseName: string
  cameras: { deviceNo: string; position: string; online: DeviceOnlineStatus }[]
  gates?: { deviceNo: string; position: string; online: DeviceOnlineStatus }[]
  rfidReaders?: { deviceNo: string; position: string; online: DeviceOnlineStatus }[]
}

// ==========================================
// 监管车辆（核心实体）
// ==========================================

/** 监管车辆 */
export interface SupervisedVehicle {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  storeName: string
  salesperson: string
  salespersonPhone: string
  companyName: string
  warehouse: string
  stockStatus: StockStatus
  stockStatusText: string
  salesFlowStatus: SalesFlowStatus
  salesFlowStatusText: string
  supervisionStatus: SupervisionStatus
  supervisionStatusText: string
  /** 监管模式（类型化，替代原字符串） */
  supervisionMode: SupervisionMode
  /** 进出库方式 */
  entryExitMethod: EntryExitMethod
  /** 车辆级绑定设备（GPS/RFID） */
  devices: VehicleDeviceBinding[]
  /** 仓库级设备信息（摄像头/道闸，固定场所时引用） */
  warehouseDevices?: WarehouseDeviceInfo
  location: string
  loanDate: string
  cameraStatus: '正常' | '故障'
  repaymentStatus: '待回款' | '已回款'
  isSpecialEntry: boolean
  isScrapped: boolean
  stockDays: number
  /** 车辆来源 */
  source: '库存金融' | '模板导入' | '接口创建'
  /** 签注状态 */
  registrationStatus?: RegistrationStatus
  registrationStatusText?: string
  registrationTime?: string
  signTime?: string
  oldOwner?: string
  loanStatus?: '待垫款' | '已垫款'
  /** 上架信息 */
  listingPrice?: number
  wholesalePrice?: number
  inspectionReport?: '有' | '无'
  inspectionReportUrl?: string
  listingTime?: string
  listingRemark?: string
  /** 入库信息 */
  entryWarehouse?: string
  entryAddress?: string
  entryTime?: string
}

/** 用车记录 */
export interface VehicleUseRecord {
  id: string
  applicant: string
  pickerType: string
  pickerName: string
  pickerPhone: string
  pickerIdNo: string
  useType: VehicleUseType
  plateNo: string
  vin: string
  warehouse: string
  stockStatus: string
  approvalStatus: string
  deviceStatus: DeviceOnlineStatus
  applyTime: string
  useDuration: string
  location: string
  useStatus: VehicleUseStatus
  useStatusText: string
}

/** 告警记录 */
export interface AlertRecord {
  id: string
  alertNo: string
  deviceNo: string
  alertLevel: AlertLevel
  alertStatus: AlertStatus
  alertStatusText: string
  plateNo: string
  vin: string
  alertType: string
  alertContent: string
  alertLocation: string
  vehicleLocation: string
  triggerTime: string
  endTime?: string
  duration?: string
  result?: string
  remark?: string
  /** 关联监管模式 */
  supervisionMode?: SupervisionMode
}

/** 盘点记录 */
export interface InventoryCheckRecord {
  id: string
  warehouse: string
  totalCount: number
  checkType: InventoryCheckType
  checkTypeText: string
  checkStatus: InventoryCheckStatus
  checkStatusText: string
  checkResult: '正常' | '异常'
  checker: string
  finishTime: string
  creator: string
  createTime: string
}
