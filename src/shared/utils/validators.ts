/** VIN码校验（17位字母数字，不含I/O/Q） */
export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)
}

/** 车牌号校验 */
export function isValidPlateNo(plateNo: string): boolean {
  // 普通车牌 + 新能源车牌
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(plateNo)
}

/** 手机号校验 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/** 身份证号校验（简单） */
export function isValidIdNo(idNo: string): boolean {
  return /^\d{17}[\dXx]$/.test(idNo)
}

/** 统一社会信用代码校验 */
export function isValidCreditCode(code: string): boolean {
  return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code)
}
