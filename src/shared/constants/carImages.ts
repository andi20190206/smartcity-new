/** Mock车辆图片 — 从真实车辆照片中选取 */
const CAR_IMAGES = [
  '/images/car1.jpg',
  '/images/car2.jpg',
  '/images/car3.jpg',
  '/images/car4.jpg',
  '/images/car5.jpg',
  '/images/car6.jpg',
]

/** 根据索引或id获取车辆图片（循环复用） */
export function getCarImage(indexOrId: number | string): string {
  const idx = typeof indexOrId === 'number'
    ? indexOrId
    : Math.abs(hashCode(indexOrId))
  return CAR_IMAGES[idx % CAR_IMAGES.length]
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return h
}

/** 图片加载失败时的占位 */
export const CAR_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" fill="none"><rect width="120" height="80" rx="8" fill="#f0f0f0"/><text x="60" y="44" text-anchor="middle" fill="#ccc" font-size="12" font-family="sans-serif">暂无图片</text></svg>`
)
