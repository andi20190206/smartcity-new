import type { SupervisionMode, SupervisionAlertType, DeviceBindingStrategy } from '@shared/types'
import type { SupervisedVehicle, SupervisionPlan } from '@shared/types'
import {
  SUPERVISION_MODE_REQUIRED_DEVICES,
  ENTRY_EXIT_METHOD_BY_MODE,
  ALERT_TYPE_APPLICABLE_MODES,
  HAS_REALTIME_LOCATION,
  HAS_GEOFENCE,
  SUPERVISION_MODE_CATEGORY,
} from '@shared/constants'

/** 获取监管模式的设备绑定策略 */
export function getBindingStrategy(mode: SupervisionMode): DeviceBindingStrategy {
  const vehicleLevelTypes = new Set(['gps', 'rfid'])
  const warehouseLevelTypes = new Set(['camera', 'gate'])
  const required = SUPERVISION_MODE_REQUIRED_DEVICES[mode]

  return {
    vehicleLevel: required.filter((d) => vehicleLevelTypes.has(d)),
    warehouseLevel: required.filter((d) => warehouseLevelTypes.has(d)),
  }
}

/** 获取监管模式适用的告警类型 */
export function getApplicableAlertTypes(mode: SupervisionMode): SupervisionAlertType[] {
  return (Object.entries(ALERT_TYPE_APPLICABLE_MODES) as [SupervisionAlertType, SupervisionMode[]][])
    .filter(([, modes]) => modes.includes(mode))
    .map(([type]) => type)
}

/** 校验车辆是否满足监管方案的设备绑定要求 */
export function validateDeviceBindings(
  vehicle: SupervisedVehicle,
  plan: SupervisionPlan
): { valid: boolean; missing: string[] } {
  const strategy = getBindingStrategy(plan.mode)
  const missing: string[] = []

  // 检查车辆级设备
  for (const deviceType of strategy.vehicleLevel) {
    const bound = vehicle.devices.some((d) => d.deviceType === deviceType)
    if (!bound) missing.push(deviceType)
  }

  // 仓库级设备由仓库管理，不在车辆维度检查

  return { valid: missing.length === 0, missing }
}

/** 构建完整的监管方案（从模式推导所有属性） */
export function buildSupervisionPlan(
  companyId: string,
  mode: SupervisionMode
): Omit<SupervisionPlan, 'id' | 'alertRules'> {
  return {
    companyId,
    mode,
    category: SUPERVISION_MODE_CATEGORY[mode],
    requiredDeviceTypes: SUPERVISION_MODE_REQUIRED_DEVICES[mode],
    bindingStrategy: getBindingStrategy(mode),
    entryExitMethod: ENTRY_EXIT_METHOD_BY_MODE[mode],
    hasRealtimeLocation: HAS_REALTIME_LOCATION[mode],
    hasGeofence: HAS_GEOFENCE[mode],
  }
}
