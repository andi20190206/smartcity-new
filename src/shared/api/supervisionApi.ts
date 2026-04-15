import { get, put } from './client'
import type { SupervisionPlan, EntryExitEvent } from '@shared/types'
import type { SupervisionMode } from '@shared/types'
import type { DeviceRecord } from '@shared/types'
import type { PaginatedResponse, PaginationParams } from '@shared/types'
import type { AlertRecord } from '@shared/types'

export const supervisionApi = {
  /** 获取经销公司的监管方案 */
  getPlan: (companyId: string) =>
    get<SupervisionPlan>(`/supervision/plan/${companyId}`),

  /** 更新监管方案 */
  updatePlan: (companyId: string, data: Partial<SupervisionPlan>) =>
    put<SupervisionPlan>(`/supervision/plan/${companyId}`, data),

  /** 获取指定模式下的可用设备 */
  getDevicesByMode: (mode: SupervisionMode, warehouseId?: string) =>
    get<DeviceRecord[]>('/supervision/devices', { params: { mode, warehouseId } }),

  /** 获取车辆进出库事件 */
  getEntryExitLog: (vehicleId: string) =>
    get<EntryExitEvent[]>(`/supervision/entry-exit/${vehicleId}`),

  /** 获取告警（监管模式感知） */
  getAlerts: (params: PaginationParams & { mode?: SupervisionMode }) =>
    get<PaginatedResponse<AlertRecord>>('/supervision/alerts', { params }),
}
