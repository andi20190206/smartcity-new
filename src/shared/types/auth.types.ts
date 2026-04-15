/** 用户角色 */
export type UserRole =
  | 'dealer'           // 车商
  | 'store_manager'    // 门店经理
  | 'company_admin'    // 经销公司管理员
  | 'platform_admin'   // 平台管理员
  | 'financer'         // 资方

/** 登录用户信息 */
export interface UserInfo {
  id: string
  name: string
  phone: string
  role: UserRole
  roleText: string
  companyId?: string
  companyName?: string
  storeId?: string
  storeName?: string
  avatar?: string
}

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录响应 */
export interface LoginResponse {
  token: string
  user: UserInfo
}
