import { get, post } from './client'
import type { PaginatedResponse, PaginationParams, DeviceRecord, DeviceAlertRecord, DeviceTransferLog } from '@shared/types'
import type { DeviceType } from '@shared/types'

export const deviceApi = {
  getList: (params: PaginationParams & { deviceType?: DeviceType; keyword?: string }) =>
    get<PaginatedResponse<DeviceRecord>>('/device/list', { params }),

  getDetail: (id: string) =>
    get<DeviceRecord>(`/device/${id}`),

  /** 绑定设备到车辆 */
  bindToVehicle: (deviceId: string, data: { vin: string; plateNo: string }) =>
    post<void>(`/device/${deviceId}/bind-vehicle`, data),

  /** 绑定设备到仓库 */
  bindToWarehouse: (deviceId: string, data: { warehouseName: string; installPosition: string }) =>
    post<void>(`/device/${deviceId}/bind-warehouse`, data),

  /** 解绑设备 */
  unbind: (deviceId: string) =>
    post<void>(`/device/${deviceId}/unbind`),

  /** 设备转移 */
  transfer: (deviceId: string, data: { toOwner: string }) =>
    post<void>(`/device/${deviceId}/transfer`, data),

  /** 设备告警 */
  getAlerts: (params: PaginationParams & { deviceType?: DeviceType }) =>
    get<PaginatedResponse<DeviceAlertRecord>>('/device/alerts', { params }),

  /** 转移记录 */
  getTransferLogs: (deviceId: string) =>
    get<DeviceTransferLog[]>(`/device/${deviceId}/transfers`),
}
