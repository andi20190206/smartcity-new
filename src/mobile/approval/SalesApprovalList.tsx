import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SalesMode } from '@shared/types'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

type ApprovalTab = 'pending' | 'done'
type ApprovalResult = 'approved' | 'rejected'

interface SalesApprovalItem {
  id: string
  orderId: string
  mode: SalesMode
  applicant: string
  applicantPhone: string
  applyTime: string
  storeName: string
  // 单车信息
  brandModel: string
  plateNo: string
  mileage: number
  salesPrice: number
  contractPrice: number
  // 批量
  vehicles?: { brandModel: string; plateNo: string; salesPrice: number; contractPrice: number }[]
  result?: ApprovalResult
}

const mockPending: SalesApprovalItem[] = [
  {
    id: 'SA-001', orderId: 'SO-001', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-20 10:00', storeName: '天河旗舰店',
    brandModel: '福特 Ranger 2018款 福特Range 3.2TDCi', plateNo: '粤A123456',
    mileage: 3, salesPrice: 20000, contractPrice: 7000,
  },
  {
    id: 'SA-002', orderId: 'SO-002', mode: 'batch',
    applicant: '李先生', applicantPhone: '139****5678', applyTime: '2023-09-20 14:30', storeName: '天河旗舰店',
    brandModel: '', plateNo: '', mileage: 0, salesPrice: 240000, contractPrice: 190000,
    vehicles: [
      { brandModel: '大众 帕萨特 2019款', plateNo: '粤A111111', salesPrice: 120000, contractPrice: 90000 },
      { brandModel: '丰田 凯美瑞 2023款', plateNo: '粤B222222', salesPrice: 120000, contractPrice: 100000 },
    ],
  },
]

const mockDone: SalesApprovalItem[] = [
  {
    id: 'SA-101', orderId: 'SO-004', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-18 10:00', storeName: '天河旗舰店',
    brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', plateNo: '粤B888888',
    mileage: 1.8, salesPrice: 180000, contractPrice: 130000, result: 'approved',
  },
  {
    id: 'SA-102', orderId: 'SO-005', mode: 'single',
    applicant: '张先生', applicantPhone: '138****1234', applyTime: '2023-09-17 10:00', storeName: '天河旗舰店',
    brandModel: '大众 帕萨特新能源 2019款', plateNo: '粤A654321',
    mileage: 2.5, salesPrice: 95000, contractPrice: 100000, result: 'rejected',
  },
]

/** 销售签约审批列表 — 待审批/已审批 */
export default function SalesApprovalList() {
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
        <div className="nav-title">车辆销售签约</div>
        <div className="nav-right" />
      </div>

      {/* 搜索 */}
      <div style={{ padding: '12px 16px 0' }}>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="支持品牌、VIN、车牌搜索"
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: 'none', background: 'rgba(0,0,0,0.04)', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {/* Tab */}
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
              onClick={() => navigate(`/approval/sales/${item.id}`)}
            >
              {/* 头部 */}
              <div style={{
                padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)',
              }}>
                <span>申请人：{item.applicant}</span>
                <span>申请时间：{item.applyTime.slice(0, 10)}</span>
              </div>

              {item.mode === 'single'
                ? <SingleVehicleCard item={item} />
                : <BatchVehicleCard item={item} />
              }

              {/* 印章 */}
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

function SingleVehicleCard({ item }: { item: SalesApprovalItem }) {
  return (
    <div style={{ padding: 14, display: 'flex', gap: 12 }}>
      <img
        src={getCarImage(item.id)}
        onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
        alt={item.brandModel}
        style={{ width: 100, height: 70, borderRadius: 8, flexShrink: 0, objectFit: 'cover' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4,
        }}>{item.brandModel}</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>
          {item.plateNo} | {item.mileage}万公里 | 门店：{item.storeName}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
            采购价：<span style={{ color: 'var(--text-1)' }}>¥{item.contractPrice.toLocaleString()}</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
            销售价：<span className="price" style={{ fontSize: 13 }}>¥{item.salesPrice.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function BatchVehicleCard({ item }: { item: SalesApprovalItem }) {
  const vehicles = item.vehicles || []
  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span className="tag tag-info" style={{ fontSize: 10 }}>批量</span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>批量销售（{vehicles.length}台）</span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>
          合计 <span className="price" style={{ fontSize: 15 }}>¥{item.salesPrice.toLocaleString()}</span>
        </span>
      </div>
      {vehicles.map((v, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderTop: i > 0 ? '1px solid var(--border)' : 'none',
        }}>
          <img
            src={getCarImage(i + 30)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={v.brandModel}
            style={{ width: 52, height: 38, borderRadius: 6, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.brandModel}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{v.plateNo}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text-2)' }}>采购价 ¥{v.contractPrice.toLocaleString()}</div>
            <div className="price" style={{ fontSize: 13 }}>¥{v.salesPrice.toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
