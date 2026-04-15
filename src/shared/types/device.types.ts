import type { SupervisionMode } from './supervision.types'

/** 设备类型 */
export type DeviceType = 'gps' | 'camera' | 'rfid' | 'pda' | 'gate'

/** 设备状态 */
export type DeviceStatus = 'online' | 'offline' | 'fault'

// ==========================================
// 多态设备绑定 — 区分车辆级 vs 仓库级
// ==========================================

/** 车辆级绑定（GPS、RFID） */
export interface VehicleBinding {
  bindingType: 'vehicle'
  vin: string
  plateNo: string
  bindTime: string
}

/** 仓库级绑定（摄像头、道闸） */
export interface WarehouseBinding {
  bindingType: 'warehouse'
  warehouseName: string
  /** 安装位置（入口/出口/内部等） */
  installPosition: string
  bindTime: string
}

/** 未绑定 */
export interface UnboundDevice {
  bindingType: 'unbound'
}

/** 设备绑定 — 联合类型 */
export type DeviceBinding = VehicleBinding | WarehouseBinding | UnboundDevice

/** 设备记录 */
export interface DeviceRecord {
  id: string
  deviceNo: string
  deviceType: DeviceType
  deviceTypeText: string
  status: DeviceStatus
  statusText: string
  /** 绑定信息（多态） */
  binding: DeviceBinding
  /** 所属监管模式 */
  supervisionMode?: SupervisionMode
  /** 管理人 */
  owner: string
  ownerPhone: string
  companyName: string
  storeName: string
  /** 位置 */
  location: string
  lastHeartbeat: string
  installDate: string
  /** 设备信息 */
  manufacturer: string
  model: string
  firmwareVersion: string
  /** 摄像头专用 */
  resolution?: string
}

/** 设备转移记录 */
export interface DeviceTransferLog {
  id: string
  deviceNo: string
  deviceType: DeviceType
  fromOwner: string
  toOwner: string
  transferTime: string
  operator: string
  remark: string
}

/** 设备告警记录 */
export interface DeviceAlertRecord {
  id: string
  deviceNo: string
  deviceType: DeviceType
  alertType: string
  alertContent: string
  alertTime: string
  status: 'pending' | 'processing' | 'resolved'
  statusText: string
  handler: string
  resolveTime: string
}
