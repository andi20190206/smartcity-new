import type { DeviceType } from './device.types'

// ==========================================
// 监管方式解耦 — 核心抽象层
// ==========================================

/** 监管大类：固定场所 vs 移动 */
export type SupervisionCategory = 'fixed_location' | 'mobile'

/**
 * 具体监管模式
 * 扩展新模式只需：1. 加类型值  2. 在常量映射表补一行  3. 无需改组件
 */
export type SupervisionMode =
  | 'rfid_gate_camera'     // 固定: RFID + 道闸 + 摄像头
  | 'gate_camera'          // 固定: 纯道闸 + 摄像头
  | 'gps_camera'           // 移动: GPS/OBD + 摄像头
  | 'gps_camera_gate'      // 移动: GPS/OBD + 摄像头 + 道闸

/** 进出库方式 — 由监管模式决定 */
export type EntryExitMethod =
  | 'rfid_scan'            // RFID读卡器识别车辆标签
  | 'gate_trigger'         // 道闸开闭事件
  | 'gps_geofence'         // GPS越过仓库电子围栏
  | 'manual'               // 人工确认

/** 设备绑定策略 — 区分车辆级 vs 仓库级 */
export interface DeviceBindingStrategy {
  /** 车辆级绑定的设备类型（如GPS、RFID，每车一个） */
  vehicleLevel: DeviceType[]
  /** 仓库级绑定的设备类型（如摄像头、道闸，每仓库N个） */
  warehouseLevel: DeviceType[]
}

/** 监管方案配置 — 关联到经销公司 */
export interface SupervisionPlan {
  id: string
  companyId: string
  mode: SupervisionMode
  category: SupervisionCategory
  /** 该方案所需的设备类型 */
  requiredDeviceTypes: DeviceType[]
  /** 设备绑定策略 */
  bindingStrategy: DeviceBindingStrategy
  /** 进出库方式 */
  entryExitMethod: EntryExitMethod
  /** 告警规则 */
  alertRules: SupervisionAlertRule[]
  /** 是否支持实时位置追踪 */
  hasRealtimeLocation: boolean
  /** 是否支持电子围栏 */
  hasGeofence: boolean
}

// ==========================================
// 告警体系
// ==========================================

/** 告警类型 — 按监管模式差异化 */
export type SupervisionAlertType =
  | 'device_offline'       // 通用: 设备心跳丢失
  | 'geofence_breach'      // 移动专用: 车辆越出电子围栏
  | 'unauthorized_exit'    // 固定专用: 未经审批的道闸出库
  | 'rfid_tamper'          // RFID专用: 标签被拆除或替换
  | 'camera_fault'         // 含摄像头: 视频流中断
  | 'location_mismatch'    // 移动专用: GPS定位与预期仓库不符
  | 'long_absence'         // 通用: 车辆超时未被检测到

/** 告警规则 */
export interface SupervisionAlertRule {
  id: string
  alertType: SupervisionAlertType
  /** 适用的监管模式 */
  applicableModes: SupervisionMode[]
  /** 阈值配置（如离线时长、围栏距离等） */
  threshold?: Record<string, number>
  severity: 'high' | 'medium' | 'low'
  /** 规则描述 */
  description: string
}

// ==========================================
// 进出库事件
// ==========================================

/** 进出库事件 */
export interface EntryExitEvent {
  id: string
  vehicleId: string
  plateNo: string
  vin: string
  /** 进出类型 */
  direction: 'entry' | 'exit'
  /** 触发方式 */
  method: EntryExitMethod
  /** 触发设备 */
  deviceNo?: string
  deviceType?: DeviceType
  /** 时间 */
  timestamp: string
  /** 操作人（人工确认时） */
  operator?: string
  /** 关联用车申请（出库时） */
  vehicleUseId?: string
  /** 备注 */
  remark?: string
}
