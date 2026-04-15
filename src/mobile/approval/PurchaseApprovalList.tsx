import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PurchaseMode } from '@shared/types'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

type ApprovalTab = 'pending' | 'done'
type ApprovalResult = 'approved' | 'rejected'

interface ApprovalItem {
  id: string
  orderId: string
  mode: PurchaseMode
  applicant: string
  applicantPhone: string
  applyTime: string
  /** 单车信息 */
  brandModel: string
  plateNo: string
  mileage: number
  purchasePrice: number
  thumbUrl: string
  /** 批量车辆列表 */
  vehicles?: { brandModel: string; plateNo: string; purchasePrice: number; thumbUrl: string }[]
  /** 已审批结果 */
  result?: ApprovalResult
}

const mockPending: ApprovalItem[] = [
  {
    id: 'AP-001', orderId: 'PO-001', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00',
    brandModel: '大众帕萨特新能源2019款1.4T...', plateNo: '粤A123456', mileage: 3.3, purchasePrice: 20000,
    thumbUrl: '',
  },
  {
    id: 'AP-002', orderId: 'PO-002', mode: 'batch',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 14:30',
    brandModel: '批量采购（3台）', plateNo: '', mileage: 0, purchasePrice: 60000,
    thumbUrl: '',
    vehicles: [
      { brandModel: '大众帕萨特新能源2019款', plateNo: '粤A111111', purchasePrice: 20000, thumbUrl: '' },
      { brandModel: '丰田凯美瑞2023款 2.5L', plateNo: '粤B222222', purchasePrice: 25000, thumbUrl: '' },
      { brandModel: '本田雅阁2022款 260T', plateNo: '粤A333333', purchasePrice: 15000, thumbUrl: '' },
    ],
  },
  {
    id: 'AP-003', orderId: 'PO-005', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00',
    brandModel: '大众帕萨特新能源2019款1.4T...', plateNo: '粤A123456', mileage: 3.3, purchasePrice: 20000,
    thumbUrl: '',
  },
]

const mockDone: ApprovalItem[] = [
  {
    id: 'AP-101', orderId: 'PO-003', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00',
    brandModel: '大众帕萨特新能源2019款1.4T...', plateNo: '粤A123456', mileage: 3.3, purchasePrice: 20000,
    thumbUrl: '', result: 'approved',
  },
  {
    id: 'AP-102', orderId: 'PO-004', mode: 'batch',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00',
    brandModel: '批量采购（2台）', plateNo: '', mileage: 0, purchasePrice: 45000,
    thumbUrl: '', result: 'rejected',
    vehicles: [
      { brandModel: '大众帕萨特新能源2019款', plateNo: '粤A444444', purchasePrice: 20000, thumbUrl: '' },
      { brandModel: '丰田凯美瑞2023款 2.5L', plateNo: '粤B555555', purchasePrice: 25000, thumbUrl: '' },
    ],
  },
  {
    id: 'AP-103', orderId: 'PO-006', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00',
    brandModel: '大众帕萨特新能源2019款1.4T...', plateNo: '粤A123456', mileage: 3.3, purchasePrice: 20000,
    thumbUrl: '', result: 'rejected',
  },
]

/** 采购审批列表 — 待审批/已审批，支持单车+批量 */
export default function PurchaseApprovalList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ApprovalTab>('pending')
  const [keyword, setKeyword] = useState('')

  const items = activeTab === 'pending' ? mockPending : mockDone
  const filtered = items.filter(item => {
    if (!keyword) return true
    return item.brandModel.includes(keyword) || item.plateNo.includes(keyword) || item.orderId.includes(keyword)
  })

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate('/approval')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">车辆采购申请</div>
        <div className="nav-right" />
      </div>

      {/* 搜索 */}
      <div style={{ padding: '12px 16px 0' }}>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="支持品牌、VIN、车牌搜索"
          style={{
            width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
            border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {/* Tab切换 */}
      <div style={{ display: 'flex', padding: '14px 16px 6px', borderBottom: '1px solid var(--border)' }}>
        {([
          { key: 'pending' as const, label: '待审批' },
          { key: 'done' as const, label: '已审批' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingBottom: 10, border: 'none', background: 'none', fontSize: 15, fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--brand)' : 'var(--text-2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--brand)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div style={{ padding: '12px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-2)' }}>暂无数据</div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className={`card-glass anim d${Math.min(i + 1, 5)}`}
              style={{ marginBottom: 12, padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/approval/purchase/${item.id}`)}
            >
              {/* 头部：申请人+时间 */}
              <div style={{
                padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)',
              }}>
                <span>申请人：{item.applicant}</span>
                <span>申请时间：{item.applyTime}</span>
              </div>

              {/* 车辆内容 */}
              {item.mode === 'single' ? (
                <SingleVehicleCard item={item} />
              ) : (
                <BatchVehicleCard item={item} />
              )}

              {/* 已审批印章 */}
              {item.result && (
                <div style={{
                  position: 'absolute', top: 50, right: 16,
                  width: 60, height: 60, borderRadius: '50%',
                  border: `3px solid ${item.result === 'approved' ? 'var(--green)' : 'var(--red)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: 'rotate(-15deg)', opacity: 0.8,
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: 800,
                    color: item.result === 'approved' ? 'var(--green)' : 'var(--red)',
                  }}>
                    {item.result === 'approved' ? '通过' : '不通过'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/** 单车采购卡片 */
function SingleVehicleCard({ item }: { item: ApprovalItem }) {
  return (
    <div style={{ padding: 14, display: 'flex', gap: 12 }}>
      {/* 车辆缩略图 */}
      <img
        src={getCarImage(item.id)}
        onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
        alt={item.brandModel}
        style={{ width: 100, height: 70, borderRadius: 8, flexShrink: 0, objectFit: 'cover' }}
      />
      {/* 车辆信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text-0)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.brandModel}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
          {item.plateNo} | {item.mileage}万公里
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>采购价：</span>
          <span className="price" style={{ fontSize: 16 }}>
            ¥{item.purchasePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

/** 批量采购卡片 */
function BatchVehicleCard({ item }: { item: ApprovalItem }) {
  const vehicles = item.vehicles || []
  return (
    <div style={{ padding: 14 }}>
      {/* 批量标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span className="tag tag-info" style={{ fontSize: 10 }}>批量</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)' }}>
          批量采购（{vehicles.length}台）
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>
          合计 <span className="price" style={{ fontSize: 15 }}>¥{item.purchasePrice.toLocaleString()}</span>
        </span>
      </div>
      {/* 车辆缩略列表 */}
      {vehicles.map((v, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderTop: i > 0 ? '1px solid var(--border)' : 'none',
        }}>
          <img
            src={getCarImage(i)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={v.brandModel}
            style={{ width: 52, height: 38, borderRadius: 6, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {v.brandModel}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{v.plateNo}</div>
          </div>
          <span className="price" style={{ fontSize: 13, flexShrink: 0 }}>¥{v.purchasePrice.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
