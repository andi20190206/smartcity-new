import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

interface SaleableVehicle {
  id: string
  purchaseOrderId: string
  brandModel: string
  plateNo: string
  vin: string
  vinLast4: string
  mileage: number
  contractPrice: number
  retailPrice: number
}

const mockSaleable: SaleableVehicle[] = [
  { id: 'V-001', purchaseOrderId: 'PO-001', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: 'LSVHJ1330221761VIN', vinLast4: '1234', mileage: 3.3, contractPrice: 70000, retailPrice: 100000 },
  { id: 'V-002', purchaseOrderId: 'PO-001', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A654321', vin: 'LSVHJ1330221762VIN', vinLast4: '5678', mileage: 2.5, contractPrice: 75000, retailPrice: 105000 },
  { id: 'V-003', purchaseOrderId: 'PO-003', brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', plateNo: '粤B888888', vin: 'LSVHJ1330221763VIN', vinLast4: '9012', mileage: 1.8, contractPrice: 130000, retailPrice: 180000 },
  { id: 'V-004', purchaseOrderId: 'PO-005', brandModel: '本田 雅阁 2022款 260T 豪华版', plateNo: '粤A111111', vin: 'LSVHJ1330221764VIN', vinLast4: '3456', mileage: 4.2, contractPrice: 95000, retailPrice: 140000 },
]

/** 选择销售签约车辆 — 支持多选批量销售 */
export default function SalesSelectVehicle() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [multiMode, setMultiMode] = useState(false)

  const filtered = mockSaleable.filter(v => {
    if (!keyword) return true
    const kw = keyword.toLowerCase()
    return v.brandModel.toLowerCase().includes(kw) || v.plateNo.includes(kw) || v.vin.toLowerCase().includes(kw)
  })

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSingleSign = (id: string) => {
    // 单车：直接跳转到签约页
    navigate('/sales/create', { state: { vehicleIds: [id], mode: 'single' } })
  }

  const handleBatchSign = () => {
    if (selectedIds.size === 0) return
    const mode = selectedIds.size === 1 ? 'single' : 'batch'
    navigate('/sales/create', { state: { vehicleIds: Array.from(selectedIds), mode } })
  }

  return (
    <div className="page" style={{ paddingBottom: multiMode ? 80 : 20 }}>
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">选择销售签约车辆</div>
        <div className="nav-right" style={{ fontSize: 20, color: '#fff' }}>···</div>
      </div>

      {/* 搜索 */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="支持品牌、VIN码、车牌搜索"
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 20,
              border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 模式切换 */}
      <div style={{ padding: '10px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
          共 {filtered.length} 台在售车辆
        </span>
        <button
          onClick={() => {
            setMultiMode(!multiMode)
            setSelectedIds(new Set())
          }}
          style={{
            padding: '4px 12px', borderRadius: 16, border: '1px solid var(--brand)',
            background: multiMode ? 'var(--brand)' : 'none', color: multiMode ? '#fff' : 'var(--brand)',
            fontSize: 12, cursor: 'pointer', fontWeight: 500,
          }}
        >
          {multiMode ? '退出多选' : '批量选择'}
        </button>
      </div>

      {/* 车辆列表 */}
      <div style={{ padding: '12px 16px 0' }}>
        {filtered.map((v, i) => {
          const isSelected = selectedIds.has(v.id)
          return (
            <div
              key={v.id}
              className={`anim d${Math.min(i + 1, 5)}`}
              style={{
                marginBottom: 12, background: '#fff', borderRadius: 12, overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: isSelected ? '2px solid var(--brand)' : '2px solid transparent',
                cursor: multiMode ? 'pointer' : 'default',
              }}
              onClick={() => multiMode && toggleSelect(v.id)}
            >
              <div style={{ display: 'flex', gap: 0 }}>
                {/* 左侧：车辆图+在售标签 */}
                <div style={{ position: 'relative', width: 120, flexShrink: 0 }}>
                  <img
                    src={getCarImage(v.id)}
                    onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
                    alt={v.brandModel}
                    style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0,
                    padding: '3px 10px', fontSize: 11, fontWeight: 600,
                    background: '#FFEBEE', color: '#D32F2F', borderRadius: '0 0 8px 0',
                  }}>
                    在售
                  </span>
                  {/* 多选模式：右下角复选框 */}
                  {multiMode && (
                    <div style={{
                      position: 'absolute', bottom: 6, right: 6,
                      width: 22, height: 22, borderRadius: '50%',
                      background: isSelected ? 'var(--brand)' : 'rgba(255,255,255,0.9)',
                      border: '2px solid #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                  )}
                </div>
                {/* 右侧：信息 */}
                <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <div style={{
                      fontSize: 15, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.5,
                      height: '2.95em', overflow: 'hidden',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {v.brandModel}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
                      {v.plateNo} <span style={{ margin: '0 4px' }}>|</span> VIN后四位 {v.vinLast4}
                    </div>
                  </div>
                  {/* 单车模式：右下"销售签约"按钮 */}
                  {!multiMode && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleSingleSign(v.id) }}
                        style={{
                          padding: '6px 16px', borderRadius: 16, border: '1px solid var(--brand)',
                          background: 'none', color: 'var(--brand)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        }}
                      >
                        销售签约
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 批量模式：底部操作栏 */}
      {multiMode && (
        <div className="bottom-bar" style={{ gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-1)' }}>
            已选 <span style={{ color: 'var(--brand)', fontWeight: 700, margin: '0 4px', fontSize: 18 }}>{selectedIds.size}</span> 台
          </div>
          <button
            className="btn-primary"
            onClick={handleBatchSign}
            disabled={selectedIds.size === 0}
            style={{ flex: 1, opacity: selectedIds.size === 0 ? 0.5 : 1 }}
          >
            批量销售签约
          </button>
        </div>
      )}
    </div>
  )
}
