import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SalesStatus, SalesMode } from '@shared/types'
import { SALES_STATUS_TABS, SALES_STATUS_LABELS, SALES_STATUS_COLORS, getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

interface MockSalesOrder {
  id: string
  mode: SalesMode
  status: SalesStatus
  brandModel: string
  plateNo: string
  vinLast4: string
  mileage: number
  salesPrice: number
  vehicleCount: number
  createTime: string
  buyerName: string
  rejectReason?: string
  vehicles?: { brandModel: string; plateNo: string; salesPrice: number }[]
}

const mockOrders: MockSalesOrder[] = [
  { id: 'SO-001', mode: 'single', status: 'pending_internal', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A123456', vinLast4: '1234', mileage: 3.3, salesPrice: 100000, vehicleCount: 1, createTime: '2026-04-16 10:00', buyerName: '张三' },
  { id: 'SO-002', mode: 'batch', status: 'pending_approval', brandModel: '', plateNo: '', vinLast4: '', mileage: 0, salesPrice: 240000, vehicleCount: 2, createTime: '2026-04-15 14:30', buyerName: '李四',
    vehicles: [
      { brandModel: '大众 帕萨特 2019款', plateNo: '粤A111111', salesPrice: 120000 },
      { brandModel: '丰田 凯美瑞 2023款', plateNo: '粤B222222', salesPrice: 120000 },
    ],
  },
  { id: 'SO-003', mode: 'single', status: 'pending_payment', brandModel: '本田 雅阁 2022款 260T 豪华版', plateNo: '粤A111111', vinLast4: '3456', mileage: 4.2, salesPrice: 140000, vehicleCount: 1, createTime: '2026-04-14 09:20', buyerName: '王五' },
  { id: 'SO-004', mode: 'single', status: 'sold', brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', plateNo: '粤B888888', vinLast4: '9012', mileage: 1.8, salesPrice: 180000, vehicleCount: 1, createTime: '2026-04-13 16:45', buyerName: '赵六' },
  { id: 'SO-005', mode: 'single', status: 'rejected', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A654321', vinLast4: '5678', mileage: 2.5, salesPrice: 95000, vehicleCount: 1, createTime: '2026-04-12 11:00', buyerName: '钱七', rejectReason: '买家信息认证失败' },
  { id: 'SO-006', mode: 'single', status: 'cancelled', brandModel: '大众 帕萨特新能源 2019款 1.4T 智能四驱版本', plateNo: '粤A666666', vinLast4: '7890', mileage: 3.0, salesPrice: 98000, vehicleCount: 1, createTime: '2026-04-11 14:00', buyerName: '孙八' },
]

/** 销售签约列表 */
export default function SalesList() {
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
        <div className="nav-title">销售签约列表</div>
        <div className="nav-right" />
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
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
              border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Tab */}
      <div style={{
        display: 'flex', padding: '14px 16px 0', gap: 0, overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
      }}>
        {SALES_STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0 12px 10px', border: 'none', background: 'none', whiteSpace: 'nowrap',
              fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--brand)' : 'var(--text-2)',
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
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-2)' }}>暂无数据</div>
        ) : (
          filtered.map((order, i) => (
            <div
              key={order.id}
              className={`anim d${Math.min(i + 1, 5)}`}
              style={{
                marginBottom: 12, background: '#fff', borderRadius: 12,
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={() => navigate(`/sales/detail/${order.id}`)}
            >
              {order.mode === 'single' ? <SingleCard order={order} /> : <BatchCard order={order} />}
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate('/sales/select')} style={{ bottom: 80 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  )
}

function SingleCard({ order }: { order: MockSalesOrder }) {
  const statusStyle = SALES_STATUS_COLORS[order.status]
  const hasAction = order.status === 'pending_internal' || order.status === 'pending_approval' || order.status === 'pending_payment'
    || order.status === 'rejected' || order.status === 'cancelled'

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      <div style={{ position: 'relative', width: 120, flexShrink: 0 }}>
        <img
          src={getCarImage(order.id)}
          onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
          alt={order.brandModel}
          style={{ width: '100%', height: '100%', minHeight: hasAction ? 130 : 100, objectFit: 'cover', display: 'block' }}
        />
        <span style={{
          position: 'absolute', top: 0, left: 0,
          padding: '3px 10px', fontSize: 11, fontWeight: 600,
          background: statusStyle.bg, color: statusStyle.color,
          borderRadius: '0 0 8px 0',
        }}>
          {SALES_STATUS_LABELS[order.status]}
        </span>
      </div>
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          <div style={{
            fontSize: 15, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.5,
            height: '2.95em', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {order.brandModel}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            {order.plateNo} <span style={{ margin: '0 4px' }}>|</span> VIN后四位 {order.vinLast4}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            销售价 <span className="price" style={{ fontSize: 14 }}>¥{order.salesPrice.toLocaleString()}</span>
          </div>
          {order.rejectReason && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>
              驳回原因：{order.rejectReason}
            </div>
          )}
        </div>
        {hasAction && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
            {(order.status === 'pending_internal' || order.status === 'pending_approval' || order.status === 'pending_payment') && (
              <button onClick={e => { e.stopPropagation() }} style={actionBtnStyle}>取消销售</button>
            )}
            {(order.status === 'rejected' || order.status === 'cancelled') && (
              <button onClick={e => { e.stopPropagation() }} style={{ ...actionBtnStyle, borderColor: 'var(--brand)', color: 'var(--brand)' }}>重新销售</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BatchCard({ order }: { order: MockSalesOrder }) {
  const statusStyle = SALES_STATUS_COLORS[order.status]
  const vehicles = order.vehicles || []
  return (
    <div>
      <div style={{
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4,
            background: statusStyle.bg, color: statusStyle.color,
          }}>
            {SALES_STATUS_LABELS[order.status]}
          </span>
          <span className="tag tag-info" style={{ fontSize: 10 }}>批量</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            批量销售（{order.vehicleCount}台）
          </span>
        </div>
        <span className="price" style={{ fontSize: 15 }}>¥{order.salesPrice.toLocaleString()}</span>
      </div>
      {vehicles.map((v, i) => (
        <div key={i} style={{
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: i < vehicles.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <img
            src={getCarImage(i + 20)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={v.brandModel}
            style={{ width: 52, height: 38, borderRadius: 6, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.brandModel}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{v.plateNo}</div>
          </div>
          <span className="price" style={{ fontSize: 13, flexShrink: 0 }}>¥{v.salesPrice.toLocaleString()}</span>
        </div>
      ))}
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>买家：{order.buyerName}</span>
        {(order.status === 'pending_internal' || order.status === 'pending_approval' || order.status === 'pending_payment') && (
          <button onClick={e => { e.stopPropagation() }} style={actionBtnStyle}>取消销售</button>
        )}
      </div>
    </div>
  )
}

const actionBtnStyle: React.CSSProperties = {
  padding: '5px 16px', borderRadius: 16, border: '1px solid var(--text-3)',
  background: 'none', fontSize: 12, color: 'var(--text-1)', cursor: 'pointer', fontWeight: 500,
}
