import axios from 'axios'
import type { ApiResponse } from '@shared/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：注入JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>
    if (data.code !== 0 && data.code !== 200) {
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.hash = '#/login'
    }
    return Promise.reject(error)
  }
)

/** 类型化GET */
export async function get<T>(url: string, config?: Parameters<typeof apiClient.get>[1]): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, config)
  return res.data.data
}

/** 类型化POST */
export async function post<T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.post>[2]): Promise<T> {
  const res = await apiClient.post<ApiResponse<T>>(url, data, config)
  return res.data.data
}

/** 类型化PUT */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  const res = await apiClient.put<ApiResponse<T>>(url, data)
  return res.data.data
}

/** 类型化DELETE */
export async function del<T>(url: string): Promise<T> {
  const res = await apiClient.delete<ApiResponse<T>>(url)
  return res.data.data
}

export default apiClient
