import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER, SALES_FLOW_STEPS } from '@shared/constants'
import type { SalesMode, BuyerInfo } from '@shared/types'

interface SelectedVehicleInfo {
  id: string
  purchaseOrderId: string
  brandModel: string
  plateNo: string
  vin: string
  mileage: number
  contractPrice: number
}

/** Mock：根据ID取车辆信息 */
const MOCK_VEHICLES: Record<string, SelectedVehicleInfo> = {
  'V-001': { id: 'V-001', purchaseOrderId: 'PO-001', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: 'LSVHJ1330221761VIN', mileage: 3.3, contractPrice: 70000 },
  'V-002': { id: 'V-002', purchaseOrderId: 'PO-001', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A654321', vin: 'LSVHJ1330221762VIN', mileage: 2.5, contractPrice: 75000 },
  'V-003': { id: 'V-003', purchaseOrderId: 'PO-003', brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', plateNo: '粤B888888', vin: 'LSVHJ1330221763VIN', mileage: 1.8, contractPrice: 130000 },
  'V-004': { id: 'V-004', purchaseOrderId: 'PO-005', brandModel: '本田 雅阁 2022款 260T 豪华版', plateNo: '粤A111111', vin: 'LSVHJ1330221764VIN', mileage: 4.2, contractPrice: 95000 },
}

/** 销售签约申请页 — 支持单车和批量（多台卖给同一买家） */
export default function SalesCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { vehicleIds = [], mode = 'single' } = (location.state || {}) as { vehicleIds?: string[]; mode?: SalesMode }

  const vehicles = vehicleIds.map(id => MOCK_VEHICLES[id]).filter(Boolean)
  const [activeVehicleIdx, setActiveVehicleIdx] = useState(0)

  // 每台车独立的销售价
  const [salesPrices, setSalesPrices] = useState<Record<string, string>>({})
  // 买家信息（共用）
  const [buyer, setBuyer] = useState<Partial<BuyerInfo>>({})
  // 签名
  const [advisorSigned, setAdvisorSigned] = useState(false)
  const [buyerSigned, setBuyerSigned] = useState(false)

  const currentVehicle = vehicles[activeVehicleIdx]
  const isBatch = mode === 'batch' && vehicles.length > 1

  const setSalesPrice = (id: string, price: string) => {
    setSalesPrices(prev => ({ ...prev, [id]: price }))
  }

  const totalSalesPrice = vehicles.reduce((sum, v) => sum + (Number(salesPrices[v.id]) || 0), 0)

  const handleSubmit = () => {
    navigate('/sales/success', { state: { mode, vehicleCount: vehicles.length } })
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">{isBatch ? '批量销售签约' : '车辆销售签约'}</div>
        <div className="nav-right" />
      </div>

      {/* ===== 车辆信息 ===== */}
      <div className="card-glass anim" style={{ margin: '12px 16px', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            车辆信息
            {isBatch && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--brand)', fontWeight: 500 }}>批量 {vehicles.length} 台</span>}
          </div>
          {isBatch && (
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>合同价合计 ¥{vehicles.reduce((s, v) => s + v.contractPrice, 0).toLocaleString()}</span>
          )}
        </div>

        {/* 批量车辆切换器 */}
        {isBatch && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {vehicles.map((_, i) => (
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
          </div>
        )}

        {/* 当前车辆信息 */}
        {currentVehicle && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <img
                src={getCarImage(currentVehicle.id)}
                onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
                alt={currentVehicle.brandModel}
                style={{ width: 80, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{currentVehicle.brandModel}</div>
            </div>
            <InfoRow label="VIN码" value={currentVehicle.vin} />
            <InfoRow label="车牌" value={currentVehicle.plateNo} />
            <InfoRow label="里程" value={`${currentVehicle.mileage}万公里`} />
            <InfoRow label="采购合同价" value={`¥${currentVehicle.contractPrice.toLocaleString()}`} />
          </>
        )}
      </div>

      {/* ===== 买家信息（共用） ===== */}
      <div className="card-glass anim d1" style={{ margin: '0 16px 12px', padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          买家信息 {isBatch && <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 400 }}>（同一买家）</span>}
        </div>

        <FieldRow label="身份证" required>
          <div style={{ display: 'flex', gap: 8 }}>
            <PhotoUpload label="人像面" />
            <PhotoUpload label="国徽面" />
          </div>
        </FieldRow>

        <FieldRow label="买家姓名" required>
          <input
            value={buyer.buyerName || ''}
            onChange={e => setBuyer(b => ({ ...b, buyerName: e.target.value }))}
            placeholder="OCR识别或手动输入"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="身份证号码" required>
          <input
            value={buyer.idNo || ''}
            onChange={e => setBuyer(b => ({ ...b, idNo: e.target.value }))}
            placeholder="请输入"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="买家手机" required>
          <input
            type="tel"
            value={buyer.buyerPhone || ''}
            onChange={e => setBuyer(b => ({ ...b, buyerPhone: e.target.value }))}
            placeholder="请输入"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="收款银行卡" required>
          <PhotoUpload label="卡号面" />
        </FieldRow>

        <FieldRow label="银行卡号" required>
          <input
            value={buyer.bankCardNo || ''}
            onChange={e => setBuyer(b => ({ ...b, bankCardNo: e.target.value }))}
            placeholder="OCR识别或手动输入"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="开户行" required>
          <input
            value={buyer.bankName || ''}
            onChange={e => setBuyer(b => ({ ...b, bankName: e.target.value }))}
            placeholder="请选择银行"
            style={inputStyle}
          />
        </FieldRow>
      </div>

      {/* ===== 价格信息 ===== */}
      <div className="card-glass anim d2" style={{ margin: '0 16px 12px', padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>价格信息</div>

        {/* 单车：一个销售价 */}
        {!isBatch && currentVehicle && (
          <FieldRow label="销售价" required>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={salesPrices[currentVehicle.id] || ''}
                onChange={e => setSalesPrice(currentVehicle.id, e.target.value)}
                placeholder="请输入"
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ fontSize: 14, color: 'var(--text-2)' }}>元</span>
            </div>
          </FieldRow>
        )}

        {/* 批量：每台独立定价 */}
        {isBatch && (
          <>
            {vehicles.map((v, i) => (
              <div key={v.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < vehicles.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>第{i + 1}台</span>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.plateNo} · {v.brandModel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    value={salesPrices[v.id] || ''}
                    onChange={e => setSalesPrice(v.id, e.target.value)}
                    placeholder="销售价"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>元</span>
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', background: 'var(--brand-bg)', borderRadius: 8, marginTop: 4,
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-1)' }}>销售价合计</span>
              <span className="price" style={{ fontSize: 18 }}>
                ¥{totalSalesPrice.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ===== 签名信息 ===== */}
      <div className="card-glass anim d3" style={{ margin: '0 16px 12px', padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>签名信息</div>
        <SignRow label="销售顾问签名" signed={advisorSigned} onToggle={() => setAdvisorSigned(!advisorSigned)} />
        <SignRow label="买家签名" signed={buyerSigned} onToggle={() => setBuyerSigned(!buyerSigned)} />
      </div>

      {/* ===== 销售签约流程指引 ===== */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', textAlign: 'center', marginBottom: 8 }}>
          销售签约流程
        </div>
        <div className="steps" style={{ background: 'transparent', padding: 0 }}>
          {SALES_FLOW_STEPS.map((step, i) => (
            <div className="step" key={step.index}>
              {i > 0 && <div className="step-line" />}
              <div className="step-dot pending">{i + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提交 */}
      <div className="bottom-bar">
        <button className="btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
          {isBatch ? '批量销售签约申请' : '销售签约申请'}
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 子组件
// ==========================================

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
        {required && <span style={{ color: 'var(--red)' }}>* </span>}
        {label}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-0)' }}>{value}</span>
    </div>
  )
}

function PhotoUpload({ label }: { label: string }) {
  return (
    <div style={{
      flex: 1, aspectRatio: '3/2', background: 'var(--bg-warm)', borderRadius: 8,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      border: '1px dashed var(--text-3)', cursor: 'pointer',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3"/>
        <path d="M9 6l1.5-2h3L15 6"/>
      </svg>
      <span style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{label}</span>
    </div>
  )
}

function SignRow({ label, signed, onToggle }: { label: string; signed: boolean; onToggle: () => void }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-1)' }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          color: signed ? 'var(--green)' : 'var(--text-3)', fontSize: 13,
        }}
      >
        {signed ? '已签名' : '未签名'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--border-strong)', fontSize: 14,
  background: 'var(--bg-warm)', color: 'var(--text-0)', outline: 'none',
}
