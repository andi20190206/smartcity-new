import { useLocation, useNavigate } from 'react-router-dom'
import type { SalesMode } from '@shared/types'

interface SuccessState {
  mode: SalesMode
  vehicleCount: number
  orderId?: string
  needInternalApproval?: boolean
}

/** 销售提交成功页 */
export default function SalesSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode = 'single', vehicleCount = 1, orderId = 'SO-20260416001', needInternalApproval = true } = (location.state || {}) as SuccessState

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate('/sales')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">提交结果</div>
        <div className="nav-right" />
      </div>

      <div style={{ textAlign: 'center', padding: '48px 24px 24px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--green-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>销售签约提交成功</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
          {needInternalApproval ? '已收到您的车辆销售申请，待门店负责人审批' : '已收到您的车辆销售合同申请，我们将尽快处理为您办理'}
        </p>
      </div>

      <div className="card-glass anim" style={{ margin: '0 16px 16px', padding: 16 }}>
        <InfoRow label="申请单号" value={orderId} />
        <InfoRow label="销售模式" value={mode === 'single' ? '单车销售' : `批量销售（${vehicleCount}台）`} />
        {needInternalApproval && (
          <div style={{
            marginTop: 12, padding: '8px 12px', borderRadius: 8,
            background: 'var(--orange-bg)', fontSize: 12, color: 'var(--orange)',
          }}>
            ⏳ 需门店负责人审批后，才会进入经销公司审批流程
          </div>
        )}
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 10 }}>
        <button className="btn-secondary" onClick={() => navigate('/sales')} style={{ flex: 1 }}>销售列表</button>
        <button className="btn-primary" onClick={() => navigate(`/sales/detail/${orderId}`)} style={{ flex: 1 }}>查看详情</button>
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
