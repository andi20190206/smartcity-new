import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PurchaseStatus, PurchaseMode } from '@shared/types'
import { PURCHASE_STATUS_TABS, PURCHASE_STATUS_LABELS, getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

/** Mock数据 */
const mockOrders = [
  { id: 'PO-001', mode: 'single' as PurchaseMode, status: 'pending_internal' as PurchaseStatus, brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: '1234', totalPrice: 80000, vehicleCount: 1, createTime: '2026-04-15 10:00', applicant: '张伟' },
  { id: 'PO-002', mode: 'batch' as PurchaseMode, status: 'pending_approval' as PurchaseStatus, brandModel: '', plateNo: '', vin: '', totalPrice: 350000, vehicleCount: 3, createTime: '2026-04-14 14:30', applicant: '李明',
    batchVehicles: [
      { brandModel: '大众 帕萨特 2019款', plateNo: '粤A111111', purchasePrice: 120000 },
      { brandModel: '丰田 凯美瑞 2023款', plateNo: '粤B222222', purchasePrice: 130000 },
      { brandModel: '本田 雅阁 2022款', plateNo: '粤A333333', purchasePrice: 100000 },
    ],
  },
  { id: 'PO-003', mode: 'single' as PurchaseMode, status: 'pending_approval' as PurchaseStatus, brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: '1234', totalPrice: 120000, vehicleCount: 1, createTime: '2026-04-13 09:20', applicant: '张伟' },
  { id: 'PO-004', mode: 'single' as PurchaseMode, status: 'signed' as PurchaseStatus, brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: '1234', totalPrice: 120000, vehicleCount: 1, createTime: '2026-04-12 16:45', applicant: '张伟' },
  { id: 'PO-005', mode: 'single' as PurchaseMode, status: 'rejected' as PurchaseStatus, brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: '1234', totalPrice: 95000, vehicleCount: 1, createTime: '2026-04-11 11:00', applicant: '张伟', rejectReason: '采购价格偏高' },
  { id: 'PO-006', mode: 'single' as PurchaseMode, status: 'cancelled' as PurchaseStatus, brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vin: '1234', totalPrice: 95000, vehicleCount: 1, createTime: '2026-04-10 14:00', applicant: '张伟' },
]

/** 状态标签样式 */
const STATUS_TAG_STYLES: Record<PurchaseStatus, { bg: string; color: string }> = {
  pending_internal: { bg: '#FFF3E0', color: '#F57C00' },
  pending_approval: { bg: '#E3F2FD', color: '#1976D2' },
  signed: { bg: '#E8F5E9', color: '#388E3C' },
  rejected: { bg: '#FFEBEE', color: '#D32F2F' },
  cancelled: { bg: '#F5F5F5', color: '#9E9E9E' },
}

/** 采购列表页 — 单车用图文横排卡片样式，批量用汇总卡片 */
export default function PurchaseList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [keyword, setKeyword] = useState('')

  const filtered = mockOrders.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false
    if (!keyword) return true
    const kw = keyword.toLowerCase()
    return o.brandModel.toLowerCase().includes(kw) || o.plateNo.includes(kw) || o.id.includes(kw)
  })

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">采购单列表</div>
        <div className="nav-right" />
      </div>

      {/* 搜索栏 */}
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
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
              border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14,
              outline: 'none', color: 'var(--text-0)',
            }}
          />
        </div>
      </div>

      {/* 状态Tab — 横排文字下划线样式 */}
      <div style={{
        display: 'flex', padding: '14px 16px 0', gap: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        {PURCHASE_STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingBottom: 10, border: 'none', background: 'none',
              fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer', color: activeTab === tab.key ? 'var(--brand)' : 'var(--text-2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--brand)' : '2px solid transparent',
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div style={{ padding: '12px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-2)', fontSize: 14 }}>
            暂无采购记录
          </div>
        ) : (
          filtered.map((order, i) => (
            <div
              key={order.id}
              className={`anim d${Math.min(i + 1, 5)}`}
              style={{
                marginBottom: 12, background: 'var(--surface)', borderRadius: 12,
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={() => navigate(`/purchase/detail/${order.id}`)}
            >
              {order.mode === 'single' ? (
                <SingleCard order={order} />
              ) : (
                <BatchCard order={order} />
              )}
            </div>
          ))
        )}
      </div>

      {/* FAB: 发起采购 */}
      <button className="fab" onClick={() => navigate('/purchase/create')} style={{ bottom: 80 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  )
}

/** 单车采购卡片 — 左图右信息（匹配原有截图样式） */
function SingleCard({ order }: { order: typeof mockOrders[0] }) {
  const tagStyle = STATUS_TAG_STYLES[order.status]
  const hasAction = order.status === 'pending_internal' || order.status === 'pending_approval'
    || order.status === 'rejected' || order.status === 'cancelled'

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* 左侧：车辆图片 + 状态标签叠加 */}
      <div style={{ position: 'relative', width: 120, flexShrink: 0 }}>
        <img
          src={getCarImage(order.id)}
          onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
          alt={order.brandModel}
          style={{ width: '100%', height: '100%', minHeight: hasAction ? 120 : 90, objectFit: 'cover', display: 'block' }}
        />
        {/* 状态标签 — 左上角覆盖 */}
        <span style={{
          position: 'absolute', top: 0, left: 0,
          padding: '3px 10px', fontSize: 11, fontWeight: 600,
          background: tagStyle.bg, color: tagStyle.color,
          borderRadius: '0 0 8px 0',
        }}>
          {PURCHASE_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* 右侧：车辆信息 */}
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        {/* 品牌车型 — 固定2行展示 */}
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.5,
          height: '2.95em', overflow: 'hidden',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {order.brandModel}
        </div>

        {/* 车牌 | VIN后四位 */}
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
          {order.plateNo}
          {order.vin ? <span style={{ margin: '0 4px' }}>|</span> : null}
          {order.vin ? `VIN后四位 ${order.vin}` : null}
        </div>

        {/* 操作按钮 — 右对齐 */}
        {hasAction && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8 }}>
            {(order.status === 'pending_internal' || order.status === 'pending_approval') && (
              <button onClick={e => { e.stopPropagation() }} style={actionBtnStyle}>取消采购</button>
            )}
            {(order.status === 'rejected' || order.status === 'cancelled') && (
              <button onClick={e => { e.stopPropagation() }} style={{ ...actionBtnStyle, borderColor: 'var(--brand)', color: 'var(--brand)' }}>重新采购</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** 批量采购卡片 — 汇总 + 车辆缩略列表 */
function BatchCard({ order }: { order: typeof mockOrders[0] }) {
  const tagStyle = STATUS_TAG_STYLES[order.status]
  const vehicles = (order as any).batchVehicles || []

  return (
    <div>
      {/* 头部 */}
      <div style={{
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4,
            background: tagStyle.bg, color: tagStyle.color,
          }}>
            {PURCHASE_STATUS_LABELS[order.status]}
          </span>
          <span className="tag tag-info" style={{ fontSize: 10 }}>批量</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>
            批量采购（{order.vehicleCount}台）
          </span>
        </div>
        <span className="price" style={{ fontSize: 15 }}>
          ¥{order.totalPrice.toLocaleString()}
        </span>
      </div>

      {/* 车辆列表 */}
      {vehicles.map((v: any, i: number) => (
        <div key={i} style={{
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: i < vehicles.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <img
            src={getCarImage(i)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={v.brandModel}
            style={{ width: 52, height: 38, borderRadius: 6, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {v.brandModel}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{v.plateNo}</div>
          </div>
          <span className="price" style={{ fontSize: 13, flexShrink: 0 }}>¥{v.purchasePrice.toLocaleString()}</span>
        </div>
      ))}

      {/* 底部操作 */}
      {(order.status === 'pending_internal' || order.status === 'pending_approval') && (
        <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={e => { e.stopPropagation() }} style={actionBtnStyle}>取消采购</button>
        </div>
      )}
      {(order.status === 'rejected' || order.status === 'cancelled') && (
        <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={e => { e.stopPropagation() }} style={{ ...actionBtnStyle, borderColor: 'var(--brand)', color: 'var(--brand)' }}>重新采购</button>
        </div>
      )}
    </div>
  )
}

const actionBtnStyle: React.CSSProperties = {
  padding: '5px 16px', borderRadius: 16, border: '1px solid var(--text-3)',
  background: 'none', fontSize: 12, color: 'var(--text-1)', cursor: 'pointer', fontWeight: 500,
}
