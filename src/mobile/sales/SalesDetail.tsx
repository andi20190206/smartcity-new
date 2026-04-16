import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SALES_STATUS_LABELS, SALES_FLOW_STEPS, getCarImage, CAR_PLACEHOLDER } from '@shared/constants'
import type { SalesStatus, SalesMode } from '@shared/types'

interface SalesVehicle {
  plateNo: string
  vin: string
  brandModel: string
  mileage: number
  salesPrice: number
  contractPrice: number
}

interface DetailData {
  id: string
  mode: SalesMode
  status: SalesStatus
  statusTime: string
  statusDesc: string
  currentStep: number
  vehicles: SalesVehicle[]
  totalSalesPrice: number
  buyer: {
    name: string
    phone: string
    idNo: string
    idCardPhotos: string[]
    bankCardNo: string
    bankName: string
  }
  rejectReason?: string
}

/** Mock数据 */
const mockSingle: DetailData = {
  id: '50004608617448071587',
  mode: 'single',
  status: 'pending_internal',
  statusTime: '2023-02-15 18:38:44',
  statusDesc: '提交成功，待门店负责人确认',
  currentStep: 0,
  vehicles: [{ plateNo: '粤H42K92', vin: 'L6T7742Z3GN411081', brandModel: '博越 2016款博越 1.8TD 自动智慧', mileage: 3.3, salesPrice: 100000, contractPrice: 70000 }],
  totalSalesPrice: 100000,
  buyer: {
    name: '范怜', phone: '13403957900', idNo: '611021199612259046',
    idCardPhotos: [getCarImage('id-1'), getCarImage('id-2')],
    bankCardNo: '6230580100009272884', bankName: '中国银行',
  },
}

const mockBatch: DetailData = {
  ...mockSingle,
  id: 'SO-002',
  mode: 'batch',
  status: 'pending_approval',
  statusTime: '2023-02-15 18:38:44',
  statusDesc: '店内审批通过，待经销公司审批',
  currentStep: 1,
  vehicles: [
    { plateNo: '粤A111111', vin: 'LSVHJ1330221761VIN', brandModel: '大众 帕萨特 2019款 1.4T 智能版', mileage: 3.3, salesPrice: 120000, contractPrice: 90000 },
    { plateNo: '粤B222222', vin: 'LSVHJ1330221762VIN', brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', mileage: 1.8, salesPrice: 120000, contractPrice: 100000 },
  ],
  totalSalesPrice: 240000,
}

/** 销售签约详情页 */
export default function SalesDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeVehicleIdx, setActiveVehicleIdx] = useState(0)

  const d = id === 'SO-002' ? mockBatch : mockSingle
  const isBatch = d.mode === 'batch'
  const vehicle = d.vehicles[activeVehicleIdx]

  const getStatusColor = (s: SalesStatus): string => {
    if (s === 'sold') return 'var(--green)'
    if (s === 'rejected' || s === 'cancelled') return 'var(--red)'
    return 'var(--orange)'
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">销售签约详情</div>
        <div className="nav-right" />
      </div>

      {/* 流程指引 */}
      <div style={{ padding: '10px 16px', fontSize: 11, color: 'var(--text-2)', background: 'var(--bg-warm)' }}>
        销售流程：合同填写 → 合同审批 → 买家付款 → 完成
      </div>

      {/* 状态区 */}
      <div style={{ textAlign: 'center', padding: '28px 16px 20px', background: '#fff' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: getStatusColor(d.status), marginBottom: 6 }}>
          {SALES_STATUS_LABELS[d.status]}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{d.statusDesc}</p>
        {d.rejectReason && (
          <div style={{
            margin: '12px 16px 0', padding: '8px 12px', borderRadius: 8,
            background: 'var(--red-bg)', fontSize: 12, color: 'var(--red)',
          }}>
            驳回理由：{d.rejectReason}
          </div>
        )}
      </div>

      {/* 申请信息 */}
      <div className="card-glass anim" style={{ margin: '12px 16px', padding: 14 }}>
        <InfoRow label="申请单号" value={d.id} />
        <InfoRow label="申请时间" value={d.statusTime} />
        <InfoRow label="销售模式" value={isBatch ? `批量销售（${d.vehicles.length}台）` : '单车销售'} />
      </div>

      {/* 车辆信息 */}
      <div className="card-glass anim d1" style={{ margin: '0 16px 12px', padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          车辆信息
          {isBatch && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--brand)', fontWeight: 500 }}>批量 {d.vehicles.length} 台</span>}
        </div>
        {isBatch && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {d.vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVehicleIdx(i)}
                style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: i === activeVehicleIdx ? 'var(--brand)' : 'rgba(0,0,0,0.04)',
                  color: i === activeVehicleIdx ? '#fff' : 'var(--text-1)',
                }}
              >
                第{i + 1}台
              </button>
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-2)', alignSelf: 'center', marginLeft: 'auto' }}>
              合计 ¥{d.totalSalesPrice.toLocaleString()}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <img
            src={getCarImage(activeVehicleIdx)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={vehicle.brandModel}
            style={{ width: 80, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{vehicle.brandModel}</div>
        </div>
        <InfoRow label="VIN码" value={vehicle.vin} />
        <InfoRow label="车牌" value={vehicle.plateNo} />
        <InfoRow label="里程" value={`${vehicle.mileage}万公里`} />
        <InfoRow label="销售价" value={`¥${vehicle.salesPrice.toLocaleString()}`} highlight />
      </div>

      {/* 买家信息 */}
      <div className="card-glass anim d2" style={{ margin: '0 16px 12px', padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>买家信息</div>
        <InfoRow label="姓名" value={d.buyer.name} />
        <InfoRow label="手机" value={d.buyer.phone} />
        <InfoRow label="身份证" value={d.buyer.idNo} />
        {/* 身份证照片 */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>身份证照片</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {d.buyer.idCardPhotos.map((url, i) => (
              <img key={i} src={url} alt="" onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
                style={{ width: 72, height: 50, borderRadius: 6, objectFit: 'cover' }} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <InfoRow label="银行卡" value={d.buyer.bankCardNo} />
          <InfoRow label="开户行" value={d.buyer.bankName} />
        </div>
      </div>

      {/* 底部操作 */}
      {(d.status === 'pending_internal' || d.status === 'pending_approval' || d.status === 'pending_payment') && (
        <div className="bottom-bar">
          <button className="btn-secondary" style={{ flex: 1, color: 'var(--red)', borderColor: 'var(--red)' }}>
            取消销售
          </button>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{
        fontSize: 14,
        color: highlight ? 'var(--brand)' : 'var(--text-0)',
        fontWeight: highlight ? 700 : 400,
      }}>{value}</span>
    </div>
  )
}
