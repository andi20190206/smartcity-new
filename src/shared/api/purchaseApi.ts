import { get, post } from './client'
import type {
  PaginatedResponse,
  PaginationParams,
  PurchaseOrder,
  PurchaseStatus,
  BatchImportResult,
  Che300PriceInfo,
  EWalletInfo,
  OwnerInfo,
  PaymentInfo,
  VehicleItem,
} from '@shared/types'

export interface PurchaseListParams extends PaginationParams {
  status?: PurchaseStatus | 'all'
  keyword?: string
}

export interface CreatePurchaseRequest {
  mode: 'single' | 'batch'
  vehicles: Omit<VehicleItem, 'id' | 'che300Price'>[]
  ownerInfo: OwnerInfo
  paymentInfo: PaymentInfo
  signatureUrl?: string
}

export const purchaseApi = {
  getList: (params: PurchaseListParams) =>
    get<PaginatedResponse<PurchaseOrder>>('/purchase/list', { params }),

  getDetail: (id: string) =>
    get<PurchaseOrder>(`/purchase/${id}`),

  create: (data: CreatePurchaseRequest) =>
    post<PurchaseOrder>('/purchase/create', data),

  batchImport: (file: FormData) =>
    post<BatchImportResult>('/purchase/batch-import', file),

  batchUploadPhotos: (data: FormData) =>
    post<void>('/purchase/batch-photos', data),

  /** 调用车300获取精准定价 */
  getChe300Price: (vin: string, mileage: number, registerDate: string) =>
    get<Che300PriceInfo>('/external/che300/price', { params: { vin, mileage, registerDate } }),

  /** 创建中信银行电子钱包（唯车城端调用） */
  createEWallet: (data: { payeeName: string; payeeIdNo: string; payeePhone: string; payeeCardNo: string }) =>
    post<EWalletInfo>('/external/citic/ewallet', data),
}
