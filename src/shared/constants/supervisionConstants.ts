import type { SupervisionCategory, SupervisionMode, EntryExitMethod, SupervisionAlertType } from '@shared/types'
import type { DeviceType } from '@shared/types'

/** 监管大类标签 */
export const SUPERVISION_CATEGORY_LABELS: Record<SupervisionCategory, string> = {
  fixed_location: '固定场所监管',
  mobile: '移动监管',
}

/** 监管模式标签 */
export const SUPERVISION_MODE_LABELS: Record<SupervisionMode, string> = {
  rfid_gate_camera: 'RFID+道闸+摄像头',
  gate_camera: '道闸+摄像头',
  gps_camera: 'GPS+摄像头',
  gps_camera_gate: 'GPS+摄像头+道闸',
}

/** 监管模式 → 所属大类 */
export const SUPERVISION_MODE_CATEGORY: Record<SupervisionMode, SupervisionCategory> = {
  rfid_gate_camera: 'fixed_location',
  gate_camera: 'fixed_location',
  gps_camera: 'mobile',
  gps_camera_gate: 'mobile',
}

/** 监管模式 → 所需设备类型 */
export const SUPERVISION_MODE_REQUIRED_DEVICES: Record<SupervisionMode, DeviceType[]> = {
  rfid_gate_camera: ['rfid', 'gate', 'camera'],
  gate_camera: ['gate', 'camera'],
  gps_camera: ['gps', 'camera'],
  gps_camera_gate: ['gps', 'camera', 'gate'],
}

/** 监管模式 → 进出库方式 */
export const ENTRY_EXIT_METHOD_BY_MODE: Record<SupervisionMode, EntryExitMethod> = {
  rfid_gate_camera: 'rfid_scan',
  gate_camera: 'gate_trigger',
  gps_camera: 'gps_geofence',
  gps_camera_gate: 'gps_geofence',
}

/** 进出库方式标签 */
export const ENTRY_EXIT_METHOD_LABELS: Record<EntryExitMethod, string> = {
  rfid_scan: 'RFID扫描',
  gate_trigger: '道闸触发',
  gps_geofence: 'GPS围栏',
  manual: '人工确认',
}

/** 监管模式 → 是否支持实时位置 */
export const HAS_REALTIME_LOCATION: Record<SupervisionMode, boolean> = {
  rfid_gate_camera: false,
  gate_camera: false,
  gps_camera: true,
  gps_camera_gate: true,
}

/** 监管模式 → 是否支持电子围栏 */
export const HAS_GEOFENCE: Record<SupervisionMode, boolean> = {
  rfid_gate_camera: false,
  gate_camera: false,
  gps_camera: true,
  gps_camera_gate: true,
}

/** 告警类型标签 */
export const SUPERVISION_ALERT_TYPE_LABELS: Record<SupervisionAlertType, string> = {
  device_offline: '设备离线',
  geofence_breach: '越出围栏',
  unauthorized_exit: '未授权出库',
  rfid_tamper: 'RFID异常',
  camera_fault: '摄像头故障',
  location_mismatch: '定位异常',
  long_absence: '长时间未检测',
}

/** 告警类型 → 适用的监管模式 */
export const ALERT_TYPE_APPLICABLE_MODES: Record<SupervisionAlertType, SupervisionMode[]> = {
  device_offline: ['rfid_gate_camera', 'gate_camera', 'gps_camera', 'gps_camera_gate'],
  geofence_breach: ['gps_camera', 'gps_camera_gate'],
  unauthorized_exit: ['rfid_gate_camera', 'gate_camera'],
  rfid_tamper: ['rfid_gate_camera'],
  camera_fault: ['rfid_gate_camera', 'gate_camera', 'gps_camera', 'gps_camera_gate'],
  location_mismatch: ['gps_camera', 'gps_camera_gate'],
  long_absence: ['rfid_gate_camera', 'gate_camera', 'gps_camera', 'gps_camera_gate'],
}

/** 监管模式颜色（用于Tag） */
export const SUPERVISION_MODE_COLORS: Record<SupervisionMode, string> = {
  rfid_gate_camera: '#13c2c2',
  gate_camera: '#eb2f96',
  gps_camera: '#1677ff',
  gps_camera_gate: '#722ed1',
}
