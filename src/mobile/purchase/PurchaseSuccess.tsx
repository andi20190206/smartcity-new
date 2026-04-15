import { useLocation, useNavigate } from 'react-router-dom'
import type { PurchaseMode } from '@shared/types'

interface SuccessState {
  mode: PurchaseMode
  vehicleCount: number
  orderId?: string
  needInternalApproval?: boolean
}

/** 采购提交成功页 — 区分单车/批量样式 + 有无店内审批 */
export default function PurchaseSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as SuccessState

  const { mode = 'single', vehicleCount = 1, orderId = 'PO-20260415001', needInternalApproval = true } = state

  return (
    <div className="page">
      <div className="nav-brand">
        <button className="nav-back" onClick={() => navigate('/purchase')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">提交结果</div>
        <div className="nav-right" />
      </div>

      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        {/* 成功图标 */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--green-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          采购单提交成功
        </h2>

        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
          {needInternalApproval
            ? '已收到您的车辆采购申请，待门店负责人审批'
            : '已收到您的车辆采购申请，如有必要，我们将在24小时内与您联系确认车况信息，请保持手机畅通'
          }
        </p>
      </div>

      {/* 订单信息卡片 */}
      <div className="card-glass anim" style={{ margin: '0 16px 16px', padding: 16 }}>
        <InfoRow label="申请单号" value={orderId} />
        <InfoRow label="采购模式" value={mode === 'single' ? '单车采购' : `批量采购（${vehicleCount}台）`} />
        {needInternalApproval && (
          <div style={{
            marginTop: 12, padding: '8px 12px', borderRadius: 8,
            background: 'var(--orange-bg)', fontSize: 12, color: 'var(--orange)',
          }}>
            ⏳ 需门店负责人审批后，才会进入经销公司审批流程
          </div>
        )}
      </div>

      {/* 批量采购：车辆汇总 */}
      {mode === 'batch' && vehicleCount > 1 && (
        <div className="card-glass anim d1" style={{ margin: '0 16px 16px', padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>车辆汇总</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <StatItem value={vehicleCount} label="总台数" color="var(--blue)" />
            <StatItem value={vehicleCount} label="资料完整" color="var(--green)" />
            <StatItem value={0} label="待补图" color="var(--orange)" />
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ padding: '16px', display: 'flex', gap: 10 }}>
        <button className="btn-secondary" onClick={() => navigate('/purchase')} style={{ flex: 1 }}>
          采购列表
        </button>
        <button className="btn-primary" onClick={() => navigate(`/purchase/detail/${orderId}`)} style={{ flex: 1 }}>
          查看详情
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-0)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function StatItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-num)', color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
