import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PURCHASE_STATUS_LABELS, PURCHASE_STATUS_COLORS } from '@shared/constants'
import type { PurchaseStatus, PurchaseMode } from '@shared/types'

/** Mock详情数据 */
const mockDetail = {
  id: 'PO-001',
  mode: 'single' as PurchaseMode,
  status: 'pending_internal' as PurchaseStatus,
  statusDesc: '待门店负责人审批',
  createTime: '2026-04-15 10:00:00',
  applicant: '张伟',
  storeName: '天河旗舰店',
  vehicles: [
    {
      plateNo: '粤A·12345', vin: 'LVHCV6637K50CLTS1', brandModel: '大众 帕萨特新能源 2019款 1.4T 混动豪华版',
      mileage: 5.2, annualInspection: '2025-07-19', purchasePrice: 80000, deliveryLocation: '广州市天河区跑马路首尔商业街',
      collision: '正常', waterDamage: '正常', fireDamage: '正常',
    },
  ],
  totalPrice: 80000,
  ownerInfo: { ownerType: '个人' as const, ownerName: '李四', phone: '138****1234' },
}

/** 采购详情页 */
export default function PurchaseDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'vehicle' | 'condition' | 'payment'>('vehicle')
  const d = mockDetail

  const statusDescMap: Partial<Record<PurchaseStatus, string>> = {
    pending_internal: '待门店负责人审批',
    pending_approval: '采购合同待经销公司审批',
    signed: '采购已完成，您可在车辆管理中查看',
    rejected: '很遗憾，您的车辆采购未被通过',
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">采购单详情</div>
        <div className="nav-right" />
      </div>

      {/* 采购流程指引 */}
      <div style={{ padding: '10px 16px', fontSize: 11, color: 'var(--text-2)', background: 'var(--bg-warm)' }}>
        采购流程：提交申请 → 店内审批 → 经销公司审批 → 合同签订
      </div>

      {/* 状态区域 */}
      <div style={{ textAlign: 'center', padding: '24px 16px 16px' }}>
        <span className={`tag tag-${getTagClass(d.status)}`} style={{ fontSize: 14, padding: '5px 16px' }}>
          {PURCHASE_STATUS_LABELS[d.status]}
        </span>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
          {statusDescMap[d.status]}
        </p>
      </div>

      {/* 基本信息 */}
      <div className="card-glass anim" style={{ margin: '0 16px 12px', padding: 14 }}>
        <InfoRow label="申请单号" value={d.id} />
        <InfoRow label="申请时间" value={d.createTime} />
        <InfoRow label="采购模式" value={d.mode === 'single' ? '单车采购' : `批量采购（${d.vehicles.length}台）`} />
        <InfoRow label="申请人" value={d.applicant} />
        <InfoRow label="门店" value={d.storeName} />
      </div>

      {/* 三Tab切换 */}
      <div style={{ display: 'flex', margin: '0 16px', background: 'rgba(0,0,0,0.04)', borderRadius: 10, overflow: 'hidden' }}>
        {([
          { key: 'vehicle' as const, label: '车辆信息' },
          { key: 'condition' as const, label: '车况信息' },
          { key: 'payment' as const, label: '收款信息' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px 0', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab.key ? 'var(--brand)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-2)',
              borderRadius: activeTab === tab.key ? 10 : 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab内容 */}
      <div style={{ padding: '12px 16px' }}>
        {activeTab === 'vehicle' && d.vehicles.map((v, i) => (
          <div key={i} className="card-glass anim" style={{ padding: 14, marginBottom: 10 }}>
            {d.mode === 'batch' && (
              <div style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, marginBottom: 8 }}>
                第{i + 1}台 / 共{d.vehicles.length}台
              </div>
            )}
            <InfoRow label="车牌" value={v.plateNo} />
            <InfoRow label="品牌车型" value={v.brandModel} />
            <InfoRow label="VIN码" value={v.vin} />
            <InfoRow label="表显里程" value={`${v.mileage}万公里`} />
            <InfoRow label="年审有效期" value={v.annualInspection} />
            <InfoRow label="采购价格" value={`${v.purchasePrice}元`} highlight />
            <InfoRow label="交车地点" value={v.deliveryLocation} />
          </div>
        ))}

        {activeTab === 'condition' && d.vehicles.map((v, i) => (
          <div key={i} className="card-glass anim" style={{ padding: 14, marginBottom: 10 }}>
            {d.mode === 'batch' && (
              <div style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, marginBottom: 8 }}>
                第{i + 1}台
              </div>
            )}
            <InfoRow label="碰撞" value={v.collision} />
            <InfoRow label="水泡" value={v.waterDamage} />
            <InfoRow label="火烧" value={v.fireDamage} />
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-2)' }}>
              车辆照片（6张）
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 6 }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} style={{ height: 60, borderRadius: 8, background: 'rgba(0,0,0,0.04)' }} />
              ))}
            </div>
          </div>
        ))}

        {activeTab === 'payment' && (
          <div className="card-glass anim" style={{ padding: 14 }}>
            <InfoRow label="车主类型" value={d.ownerInfo.ownerType} />
            <InfoRow label="车主姓名" value={d.ownerInfo.ownerName} />
            <InfoRow label="联系电话" value={d.ownerInfo.phone} />
            <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>收款信息</div>
            <InfoRow label="收款人" value={d.ownerInfo.ownerName} />
            <InfoRow label="银行卡号" value="6225 **** **** 1234" />
            <InfoRow label="开户行" value="中国建设银行广州天河支行" />
          </div>
        )}
      </div>

      {/* 底部操作 */}
      {(d.status === 'pending_internal' || d.status === 'pending_approval') && (
        <div className="bottom-bar">
          <button className="btn-secondary" style={{ flex: 1, color: 'var(--red)', borderColor: 'var(--red)' }}>
            取消采购
          </button>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, color: highlight ? 'var(--brand)' : 'var(--text-0)', fontWeight: highlight ? 700 : 400 }}>{value}</span>
    </div>
  )
}

function getTagClass(status: PurchaseStatus): string {
  const map: Record<PurchaseStatus, string> = {
    pending_internal: 'warn',
    pending_approval: 'info',
    signed: 'success',
    rejected: 'error',
    cancelled: 'default',
  }
  return map[status]
}
