import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'
import './wcc.css'

type DetailStatus = 'signed' | 'rejected' | 'pending_review' | 'cancelled'
type DetailMode = 'single' | 'batch'

interface VehicleDetail {
  plateNo: string
  brandModel: string
  registerDate: string
  mileage: number
  source: string
  status: string
  storeName: string
  // 车况
  photos: string[]
  collision: string
  waterDamage: string
  fireDamage: string
  conditionDesc: string
  maintenanceReportPhotos: string[]
  // 其他信息
  deliveryTime: string
  purchasePrice: number
  priceStatus: string // 已通过/不通过
  evaluationPrice: number // 车辆评估价（原"平台建议价"）
  // 电子签名
  delegateSignUrl: string
  agentSignUrl: string
}

/** Mock单车详情 */
const mockSingleDetail = {
  id: 'WCC-001',
  mode: 'single' as DetailMode,
  status: 'signed' as DetailStatus,
  statusText: '签约成功',
  statusTime: '2023-02-12 13:00:15',
  rejectReason: '',
  vehicles: [{
    plateNo: '粤L32323',
    brandModel: '比亚迪油腻2022款DM-p 215KM四驱尊享旗舰',
    registerDate: '2022-08-25',
    mileage: 12.66,
    source: '外部',
    status: '在店车辆',
    storeName: '东莞唯普店',
    photos: Array.from({ length: 6 }, (_, i) => getCarImage(i)),
    collision: '正常',
    waterDamage: '正常',
    fireDamage: '正常',
    conditionDesc: '防撞梁、前后灯框架有事故类损伤无切割修复',
    maintenanceReportPhotos: Array.from({ length: 6 }, (_, i) => getCarImage(i + 6)),
    deliveryTime: '2023-01-05',
    purchasePrice: 12000,
    priceStatus: '已通过',
    evaluationPrice: 12000,
    delegateSignUrl: '',
    agentSignUrl: '',
  }],
}

const mockRejectedDetail = {
  ...mockSingleDetail,
  id: 'WCC-006',
  status: 'rejected' as DetailStatus,
  statusText: '不通过',
  statusTime: '2023-02-12 13:00:15',
  rejectReason: '无查验认证，并且采购价过高',
}

const mockBatchDetail = {
  id: 'WCC-005',
  mode: 'batch' as DetailMode,
  status: 'signed' as DetailStatus,
  statusText: '签约成功',
  statusTime: '2023-02-12 13:00:15',
  rejectReason: '',
  vehicles: [
    { ...mockSingleDetail.vehicles[0], plateNo: '粤A444444', brandModel: '大众 帕萨特 2019款 1.4T' },
    { ...mockSingleDetail.vehicles[0], plateNo: '粤B555555', brandModel: '丰田 凯美瑞 2023款 2.5L', purchasePrice: 15000, evaluationPrice: 14500 },
  ],
}

/** 唯车城采购详情页 — 签约成功/不通过，单车+批量 */
export default function WccPurchaseDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  // 根据ID选择mock数据
  const detail = id === 'WCC-006' ? mockRejectedDetail
    : id === 'WCC-005' ? mockBatchDetail
    : mockSingleDetail

  const isBatch = detail.mode === 'batch'
  const [activeVehicleIdx, setActiveVehicleIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'vehicle' | 'condition' | 'payment'>('condition')

  const currentVehicle = detail.vehicles[activeVehicleIdx]

  return (
    <div className="wcc-page" style={{ paddingBottom: 80 }}>
      <div className="wcc-nav">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">代经销采购</div>
        <div className="nav-right" style={{ fontSize: 20, color: 'var(--text-2)' }}>···</div>
      </div>

      {/* 状态头 */}
      <div style={{
        padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 10,
        background: detail.status === 'rejected' ? '#FFF0F0' : '#fff',
      }}>
        {/* 图标 */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          background: detail.status === 'rejected' ? '#FFEBEE' : '#E8F5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {detail.status === 'rejected' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#D32F2F"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#388E3C"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: detail.status === 'rejected' ? '#D32F2F' : '#388E3C' }}>
            {detail.statusText} &gt;
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
            {detail.status === 'rejected' ? '申请时间' : '签约时间'}：{detail.statusTime}
          </div>
        </div>
      </div>

      {/* 不通过原因 */}
      {detail.status === 'rejected' && detail.rejectReason && (
        <div style={{
          margin: '0 16px', padding: '8px 12px', borderRadius: 8,
          background: '#FFEBEE', border: '1px solid #FFCDD2',
          fontSize: 13, color: '#D32F2F',
        }}>
          不通过理由：{detail.rejectReason}
        </div>
      )}

      {/* 车辆卡片（单车或批量切换） */}
      <div style={{ padding: '12px 16px' }}>
        {isBatch && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {detail.vehicles.map((v, i) => (
              <button
                key={i}
                onClick={() => { setActiveVehicleIdx(i); setActiveTab('condition') }}
                style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: i === activeVehicleIdx ? '#4080FF' : 'rgba(0,0,0,0.04)',
                  color: i === activeVehicleIdx ? '#fff' : 'var(--text-1)',
                }}
              >
                第{i + 1}台
              </button>
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-2)', alignSelf: 'center', marginLeft: 'auto' }}>
              共{detail.vehicles.length}台
            </span>
          </div>
        )}

        {/* 车辆概要 */}
        <div style={{ display: 'flex', gap: 12, background: '#fff', borderRadius: 12, padding: 12, boxShadow: 'var(--shadow-sm)' }}>
          <img
            src={getCarImage(activeVehicleIdx)}
            onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
            alt={currentVehicle.brandModel}
            style={{ width: 80, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4080FF' }}>{currentVehicle.plateNo}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-0)', marginTop: 2 }}>
              {currentVehicle.brandModel}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, background: 'var(--blue-bg)', color: 'var(--blue)' }}>
                {currentVehicle.source}
              </span>
              <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, background: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }}>
                {currentVehicle.status}
              </span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
          所属门店 <span style={{ float: 'right', color: 'var(--text-0)' }}>{currentVehicle.storeName}</span>
        </div>
      </div>

      {/* 三Tab */}
      <div style={{
        display: 'flex', margin: '0 16px', borderBottom: '1px solid var(--border)',
      }}>
        {([
          { key: 'vehicle' as const, label: '车辆信息' },
          { key: 'condition' as const, label: '车况信息' },
          { key: 'payment' as const, label: '收款信息' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingBottom: 10, paddingTop: 6, border: 'none', background: 'none',
              fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer',
              color: activeTab === tab.key ? '#4080FF' : 'var(--text-2)',
              borderBottom: activeTab === tab.key ? '2px solid #4080FF' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab内容 */}
      <div style={{ padding: '12px 16px' }}>
        {activeTab === 'vehicle' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <InfoRow label="车牌" value={currentVehicle.plateNo} />
            <InfoRow label="品牌车型" value={currentVehicle.brandModel} />
            <InfoRow label="注册日期" value={currentVehicle.registerDate} />
            <InfoRow label="表显里程" value={`${currentVehicle.mileage}万公里`} />
          </div>
        )}

        {activeTab === 'condition' && (
          <>
            {/* 基础图片 */}
            <Section title={`基础图片(${currentVehicle.photos.length}张)`} arrow>
              <div style={{ display: 'flex', gap: 4, overflow: 'auto' }}>
                {currentVehicle.photos.map((url, i) => (
                  <img key={i} src={url} onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
                    style={{ width: 56, height: 42, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} alt="" />
                ))}
              </div>
            </Section>

            {/* 车况 */}
            <Section title="车况">
              <InfoRow label="碰撞" value={currentVehicle.collision} />
              <InfoRow label="水泡" value={currentVehicle.waterDamage} />
              <InfoRow label="火烧" value={currentVehicle.fireDamage} />
            </Section>

            {/* 其他描述 */}
            {currentVehicle.conditionDesc && (
              <Section title="其他描述">
                <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>
                  {currentVehicle.conditionDesc}
                </div>
              </Section>
            )}

            {/* 维保报告 */}
            <Section title="维保报告">
              <div style={{ display: 'flex', gap: 4, overflow: 'auto' }}>
                {currentVehicle.maintenanceReportPhotos.map((url, i) => (
                  <img key={i} src={url} onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
                    style={{ width: 56, height: 42, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} alt="" />
                ))}
              </div>
            </Section>

            {/* 其他信息 */}
            <Section title="其他信息">
              <InfoRow label="交车时间" value={currentVehicle.deliveryTime} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>采购价</span>
                <span style={{ fontSize: 14 }}>
                  <span style={{
                    fontSize: 11, padding: '1px 6px', borderRadius: 3, marginRight: 6,
                    background: currentVehicle.priceStatus === '已通过' ? '#E8F5E9' : '#FFEBEE',
                    color: currentVehicle.priceStatus === '已通过' ? '#388E3C' : '#D32F2F',
                  }}>
                    ● {currentVehicle.priceStatus}
                  </span>
                  <span className="price">¥{currentVehicle.purchasePrice.toLocaleString()}</span>
                </span>
              </div>
              <InfoRow label="车辆评估价" value={`¥${currentVehicle.evaluationPrice.toLocaleString()}`} />
            </Section>

            {/* 电子签名 */}
            <Section title="电子签名">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>委托人签名</span>
                <div style={{ width: 60, height: 30, borderRadius: 4, background: 'rgba(0,0,255,0.05)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>业务员签名</span>
                <div style={{ width: 60, height: 30, borderRadius: 4, background: 'rgba(0,0,255,0.05)' }} />
              </div>
            </Section>

            {/* 维保出险 */}
            <Section title="维保出险">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--text-0)' }}>维保记录</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--text-0)' }}>出险记录</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </Section>
          </>
        )}

        {activeTab === 'payment' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <InfoRow label="收款人" value="李四" />
            <InfoRow label="银行卡号" value="6225 **** **** 1234" />
            <InfoRow label="开户行" value="中国建设银行广州天河支行" />
            <InfoRow label="预留手机" value="138****1234" />
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, background: '#fff', padding: '10px 16px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        borderTop: '0.5px solid var(--border)', display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, padding: '12px 0', borderRadius: 8, border: '1px solid var(--border-strong)',
          background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>
          查看合同
        </button>
        {detail.status === 'signed' && (
          <button style={{
            flex: 1, padding: '12px 0', borderRadius: 8, border: 'none',
            background: '#4080FF', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            发起垫款
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ title, arrow, children }: { title: string; arrow?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
        {arrow && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-0)' }}>{value}</span>
    </div>
  )
}
