import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'
import './wcc.css'

/** 唯车城采购状态 */
type WccPurchaseStatus = 'pending_review' | 'pending_pricing' | 'signed' | 'rejected' | 'cancelled'

const STATUS_LABELS: Record<WccPurchaseStatus, string> = {
  pending_review: '待审核',
  pending_pricing: '待定价',
  signed: '签约完成',
  rejected: '不通过',
  cancelled: '签约取消',
}

const STATUS_COLORS: Record<WccPurchaseStatus, { bg: string; color: string }> = {
  pending_review: { bg: '#FFF3E0', color: '#F57C00' },
  pending_pricing: { bg: '#E3F2FD', color: '#1976D2' },
  signed: { bg: '#E8F5E9', color: '#388E3C' },
  rejected: { bg: '#FFEBEE', color: '#D32F2F' },
  cancelled: { bg: '#FFF3E0', color: '#F57C00' },
}

type PurchaseMode = 'single' | 'batch'

interface WccPurchaseOrder {
  id: string
  mode: PurchaseMode
  status: WccPurchaseStatus
  brandModel: string
  plateNo: string
  registerDate: string
  mileage: number
  purchasePrice: number
  contractPrice?: number
  applyTime: string
  signTime?: string
  rejectReason?: string
  /** 批量车辆 */
  vehicles?: { brandModel: string; plateNo: string; registerDate: string; mileage: number; purchasePrice: number }[]
  vehicleCount: number
  source?: '外部采购' | '唯普采购'
}

/** Mock数据 */
const mockOrders: WccPurchaseOrder[] = [
  // 待审核
  { id: 'WCC-001', mode: 'single', status: 'pending_review', brandModel: '本田元素2005款 2.4L AT EX', plateNo: '桂A123666', registerDate: '2022-08-25', mileage: 12.66, purchasePrice: 120000, applyTime: '2023-01-12 15:00:12', vehicleCount: 1 },
  { id: 'WCC-002', mode: 'batch', status: 'pending_review', brandModel: '', plateNo: '', registerDate: '', mileage: 0, purchasePrice: 350000, applyTime: '2023-01-12 14:00:00', vehicleCount: 3,
    vehicles: [
      { brandModel: '大众 帕萨特 2019款', plateNo: '粤A111111', registerDate: '2019-03-15', mileage: 5.2, purchasePrice: 120000 },
      { brandModel: '丰田 凯美瑞 2023款', plateNo: '粤B222222', registerDate: '2023-01-10', mileage: 2.1, purchasePrice: 130000 },
      { brandModel: '本田 雅阁 2022款', plateNo: '粤A333333', registerDate: '2022-06-20', mileage: 4.5, purchasePrice: 100000 },
    ],
  },
  // 待定价（配置项控制）
  { id: 'WCC-003', mode: 'single', status: 'pending_pricing', brandModel: '本田元素2005款 2.4L AT EX', plateNo: '桂A123666', registerDate: '2022-08-25', mileage: 12.66, purchasePrice: 120000, applyTime: '2023-01-12 15:00:12', vehicleCount: 1 },
  // 签约完成
  { id: 'WCC-004', mode: 'single', status: 'signed', brandModel: '本田元素2005款 2.4L AT EX', plateNo: '桂A123666', registerDate: '2022-08-25', mileage: 12.66, purchasePrice: 120000, contractPrice: 120000, applyTime: '2023-01-10 09:00:00', signTime: '2023-01-12', vehicleCount: 1, source: '外部采购' },
  { id: 'WCC-005', mode: 'batch', status: 'signed', brandModel: '', plateNo: '', registerDate: '', mileage: 0, purchasePrice: 240000, contractPrice: 240000, applyTime: '2023-01-09 10:00:00', signTime: '2023-01-11', vehicleCount: 2, source: '外部采购',
    vehicles: [
      { brandModel: '大众 帕萨特 2019款', plateNo: '粤A444444', registerDate: '2019-05-10', mileage: 6.3, purchasePrice: 120000 },
      { brandModel: '丰田 凯美瑞 2023款', plateNo: '粤B555555', registerDate: '2023-02-15', mileage: 1.8, purchasePrice: 120000 },
    ],
  },
  // 不通过
  { id: 'WCC-006', mode: 'single', status: 'rejected', brandModel: '本田元素2005款 2.4L AT EX', plateNo: '桂A123666', registerDate: '2022-08-25', mileage: 12.66, purchasePrice: 120000, applyTime: '2023-01-12 15:00:12', vehicleCount: 1, rejectReason: '未有三无验证' },
  // 签约取消
  { id: 'WCC-007', mode: 'single', status: 'cancelled', brandModel: '本田元素2005款 2.4L AT EX', plateNo: '桂A123666', registerDate: '2022-08-25', mileage: 12.66, purchasePrice: 120000, applyTime: '2023-01-12 15:00:12', vehicleCount: 1 },
]

/** 是否启用中央定价（配置项） */
const ENABLE_CENTRAL_PRICING = true

export default function WccPurchaseList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [keyword, setKeyword] = useState('')

  const tabs: { key: string; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending_review', label: '待审核' },
    ...(ENABLE_CENTRAL_PRICING ? [{ key: 'pending_pricing', label: '待定价' }] : []),
    { key: 'signed', label: '签约完成' },
    { key: 'rejected', label: '不通过' },
    { key: 'cancelled', label: '签约取消' },
  ]

  const filtered = mockOrders.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false
    if (!keyword) return true
    const kw = keyword.toLowerCase()
    return o.brandModel.toLowerCase().includes(kw) || o.plateNo.includes(kw) || o.id.includes(kw)
  })

  // 按状态分组（全部Tab时）
  const groupByStatus = activeTab === 'all'
  const grouped = groupByStatus
    ? tabs.slice(1).map(tab => ({
        status: tab.key,
        label: tab.label,
        items: filtered.filter(o => o.status === tab.key),
      })).filter(g => g.items.length > 0)
    : [{ status: activeTab, label: '', items: filtered }]

  return (
    <div className="wcc-page" style={{ paddingBottom: 20 }}>
      <div className="wcc-nav">
        <button className="nav-back" onClick={() => navigate('/wcc/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">代经销采购</div>
        <div className="nav-right" style={{ fontSize: 20, color: 'var(--text-2)' }}>···</div>
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
            placeholder="请输入车辆VIN码或车牌或车商名称"
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
              border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 状态Tab — 可横滑 */}
      <div style={{
        display: 'flex', padding: '12px 16px 0', gap: 0, overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 12px 10px', border: 'none', background: 'none', whiteSpace: 'nowrap',
              fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--wcc-brand, #4080FF)' : 'var(--text-2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--wcc-brand, #4080FF)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-2)' }}>暂无数据</div>
        ) : (
          grouped.map(group => (
            <div key={group.status}>
              {groupByStatus && (
                <div style={{ fontSize: 13, color: 'var(--text-2)', padding: '14px 0 6px' }}>{group.label}</div>
              )}
              {group.items.map((order, i) => (
                <div
                  key={order.id}
                  className={`anim d${Math.min(i + 1, 5)}`}
                  style={{
                    background: '#fff', borderRadius: 0, padding: '14px 0',
                    borderBottom: '1px solid var(--border)', cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/wcc/purchase/${order.id}`)}
                >
                  {order.mode === 'single'
                    ? <SingleItem order={order} />
                    : <BatchItem order={order} />
                  }
                </div>
              ))}
            </div>
          ))
        )}
        {filtered.length > 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: 'var(--text-3)' }}>
            共 {filtered.length} 条记录，没有更多了
          </div>
        )}
      </div>
    </div>
  )
}

/** 单车采购行 */
function SingleItem({ order }: { order: WccPurchaseOrder }) {
  const statusStyle = STATUS_COLORS[order.status]
  return (
    <div>
      {/* 来源标签（签约完成时显示） */}
      {order.source && (
        <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500,
            border: '1px solid var(--border-strong)', color: 'var(--text-2)',
          }}>{order.source}</span>
        </div>
      )}
      {/* 标题行 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)', flex: 1, marginRight: 8 }}>
          {order.brandModel}
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, flexShrink: 0,
          color: statusStyle.color,
        }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>
      {/* 车辆信息 */}
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
        {order.plateNo} | {order.registerDate} | {order.mileage}万公里
      </div>
      {/* 价格 */}
      <div style={{ marginTop: 6, fontSize: 13 }}>
        {order.status === 'signed' ? (
          <span>合同价：<span className="price">¥{(order.contractPrice || order.purchasePrice).toLocaleString()}</span></span>
        ) : (
          <span>申请采购价：<span className="price">¥{order.purchasePrice.toLocaleString()}</span></span>
        )}
      </div>
      {/* 不通过原因 */}
      {order.status === 'rejected' && order.rejectReason && (
        <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
          不通过原因：{order.rejectReason}
        </div>
      )}
      {/* 时间 */}
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
        {order.status === 'signed' ? `签约时间：${order.signTime}` : `申请时间：${order.applyTime}`}
      </div>
      {/* 操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
        {order.status === 'signed' && (
          <>
            <button style={btnOutline}>查看合同</button>
            <button style={btnPrimary}>发起垫款</button>
          </>
        )}
        {(order.status === 'rejected' || order.status === 'cancelled') && (
          <button style={btnOutline}>查看合同</button>
        )}
      </div>
    </div>
  )
}

/** 批量采购行 */
function BatchItem({ order }: { order: WccPurchaseOrder }) {
  const statusStyle = STATUS_COLORS[order.status]
  const vehicles = order.vehicles || []
  return (
    <div>
      {/* 来源标签 */}
      {order.source && (
        <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500,
            border: '1px solid var(--border-strong)', color: 'var(--text-2)',
          }}>{order.source}</span>
        </div>
      )}
      {/* 头部 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#E3F2FD', color: '#1976D2' }}>批量</span>
          <span style={{ fontSize: 15, fontWeight: 600 }}>批量采购（{order.vehicleCount}台）</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: statusStyle.color }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>
      {/* 车辆列表 */}
      {vehicles.map((v, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
          borderTop: i > 0 ? '1px solid var(--border)' : 'none',
        }}>
          <img
            src={getCarImage(i + 10)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={v.brandModel}
            style={{ width: 48, height: 34, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.brandModel}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{v.plateNo}</div>
          </div>
          <span className="price" style={{ fontSize: 13, flexShrink: 0 }}>¥{v.purchasePrice.toLocaleString()}</span>
        </div>
      ))}
      {/* 合计 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
          {order.status === 'signed' ? `签约时间：${order.signTime}` : `申请时间：${order.applyTime}`}
        </span>
        <span style={{ fontSize: 13 }}>
          合计 <span className="price" style={{ fontSize: 15 }}>¥{order.purchasePrice.toLocaleString()}</span>
        </span>
      </div>
      {/* 操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
        {order.status === 'signed' && (
          <>
            <button style={btnOutline}>查看合同</button>
            <button style={btnPrimary}>发起垫款</button>
          </>
        )}
        {(order.status === 'rejected' || order.status === 'cancelled') && (
          <button style={btnOutline}>查看合同</button>
        )}
      </div>
    </div>
  )
}

const btnOutline: React.CSSProperties = {
  padding: '6px 18px', borderRadius: 6, border: '1px solid var(--border-strong)',
  background: '#fff', fontSize: 13, color: 'var(--text-0)', cursor: 'pointer', fontWeight: 500,
}
const btnPrimary: React.CSSProperties = {
  padding: '6px 18px', borderRadius: 6, border: 'none',
  background: '#4080FF', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 500,
}
