import { useEffect } from 'react'
import { useConfigStore } from '@shared/stores/configStore'
import { useAuthStore } from '@shared/stores/authStore'
import { supervisionApi } from '@shared/api'
import {
  SUPERVISION_MODE_CATEGORY,
  SUPERVISION_MODE_REQUIRED_DEVICES,
  ENTRY_EXIT_METHOD_BY_MODE,
  HAS_REALTIME_LOCATION,
  HAS_GEOFENCE,
} from '@shared/constants'
import type { SupervisionMode, SupervisionCategory } from '@shared/types'

/**
 * 获取当前经销公司的监管配置
 */
export function useSupervisionMode() {
  const plan = useConfigStore((s) => s.supervisionPlan)
  const setSupervisionPlan = useConfigStore((s) => s.setSupervisionPlan)
  const companyId = useAuthStore((s) => s.user?.companyId)

  useEffect(() => {
    if (companyId && !plan) {
      supervisionApi.getPlan(companyId).then(setSupervisionPlan).catch(() => {})
    }
  }, [companyId, plan, setSupervisionPlan])

  const mode = plan?.mode ?? null
  const category: SupervisionCategory | null = mode ? SUPERVISION_MODE_CATEGORY[mode] : null

  return {
    plan,
    mode,
    category,
    loading: !plan && !!companyId,
    /** 该模式所需设备 */
    requiredDevices: mode ? SUPERVISION_MODE_REQUIRED_DEVICES[mode] : [],
    /** 进出库方式 */
    entryExitMethod: mode ? ENTRY_EXIT_METHOD_BY_MODE[mode] : null,
    /** 是否支持实时定位 */
    hasRealtimeLocation: mode ? HAS_REALTIME_LOCATION[mode] : false,
    /** 是否支持电子围栏 */
    hasGeofence: mode ? HAS_GEOFENCE[mode] : false,
    /** 是否为固定场所监管 */
    isFixedLocation: category === 'fixed_location',
    /** 是否为移动监管 */
    isMobile: category === 'mobile',
  }
}
