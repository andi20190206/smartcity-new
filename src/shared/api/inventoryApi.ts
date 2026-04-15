import { get, post } from './client'
import type {
  PaginatedResponse,
  PaginationParams,
  SupervisedVehicle,
  StockStatus,
  VehicleUseRecord,
  AlertRecord,
  InventoryCheckRecord,
} from '@shared/types'
import type { SupervisionMode } from '@shared/types'

export interface InventoryListParams extends PaginationParams {
  stockStatus?: StockStatus | 'all'
  supervisionMode?: SupervisionMode
  keyword?: string
}

export const inventoryApi = {
  getList: (params: InventoryListParams) =>
    get<PaginatedResponse<SupervisedVehicle>>('/inventory/list', { params }),

  getDetail: (id: string) =>
    get<SupervisedVehicle>(`/inventory/${id}`),

  /** 入库 */
  entryStock: (id: string, data: { warehouse: string }) =>
    post<void>(`/inventory/${id}/entry`, data),

  /** 上架 */
  listing: (id: string, data: { listingPrice: number; wholesalePrice?: number }) =>
    post<void>(`/inventory/${id}/listing`, data),

  /** 用车记录 */
  getVehicleUseRecords: (vehicleId: string) =>
    get<VehicleUseRecord[]>(`/inventory/${vehicleId}/use-records`),

  /** 告警记录 */
  getAlerts: (params: PaginationParams & { supervisionMode?: SupervisionMode }) =>
    get<PaginatedResponse<AlertRecord>>('/inventory/alerts', { params }),

  /** 盘点记录 */
  getCheckRecords: (params: PaginationParams) =>
    get<PaginatedResponse<InventoryCheckRecord>>('/inventory/checks', { params }),
}
