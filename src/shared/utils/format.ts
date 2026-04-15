import dayjs from 'dayjs'

/** 金额格式化（万元） */
export function formatMoney(value: number | undefined | null, unit = '万'): string {
  if (value == null) return '-'
  return `${value.toFixed(2)}${unit}`
}

/** 日期格式化 */
export function formatDate(value: string | undefined | null, format = 'YYYY-MM-DD'): string {
  if (!value) return '-'
  return dayjs(value).format(format)
}

/** 日期时间格式化 */
export function formatDateTime(value: string | undefined | null): string {
  return formatDate(value, 'YYYY-MM-DD HH:mm')
}

/** 手机号脱敏 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/** 银行卡号脱敏 */
export function maskCardNo(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo
  return cardNo.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
}

/** VIN码格式化（大写） */
export function formatVin(vin: string): string {
  return vin.toUpperCase().replace(/[^A-Z0-9]/g, '')
}
