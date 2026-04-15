import type { DeviceType, DeviceStatus } from '@shared/types'

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  gps: 'GPS定位',
  camera: '摄像头',
  rfid: 'RFID标签',
  pda: 'PDA终端',
  gate: '道闸',
}

export const DEVICE_TYPE_COLORS: Record<DeviceType, string> = {
  gps: '#1677ff',
  camera: '#722ed1',
  rfid: '#13c2c2',
  pda: '#fa8c16',
  gate: '#eb2f96',
}

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  online: '在线',
  offline: '离线',
  fault: '故障',
}

export const DEVICE_STATUS_COLORS: Record<DeviceStatus, string> = {
  online: 'green',
  offline: 'default',
  fault: 'red',
}
