import { useNavigate } from 'react-router-dom'

/** 审批入口页 — 按审批类型分组 */
const approvalEntries = [
  { key: 'purchase', label: '采购单申请', icon: '🚗', badge: 8, color: '#FF9500' },
  { key: 'sales', label: '销售单申请', icon: '💰', badge: 99, color: '#34C759' },
  { key: 'vehicle_use', label: '用车申请', icon: '📋', badge: 0, color: '#007AFF' },
]

export default function ApprovalHub() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">审批</div>
        <div className="nav-right" />
      </div>

      <div style={{ padding: '12px 16px' }}>
        {approvalEntries.map((entry, i) => (
          <div
            key={entry.key}
            className={`card-glass anim d${i + 1}`}
            style={{
              padding: '16px', marginBottom: 10, display: 'flex', alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/approval/${entry.key}`)}
          >
            {/* 图标 */}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${entry.color}15`, color: entry.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, marginRight: 14,
            }}>
              {entry.icon}
            </div>

            {/* 标题 */}
            <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text-0)' }}>
              {entry.label}
            </div>

            {/* 角标 */}
            {entry.badge > 0 && (
              <span style={{
                minWidth: 20, height: 20, borderRadius: 10, padding: '0 6px',
                background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 8,
              }}>
                {entry.badge > 99 ? '99+' : entry.badge}
              </span>
            )}

            {/* 箭头 */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        ))}
      </div>
    </div>
  )
}
