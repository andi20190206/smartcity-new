import { useNavigate } from 'react-router-dom'
import './wcc.css'

const menuItems = [
  { key: 'purchase', label: '车辆采购', icon: '📦', color: '#4080FF', route: '/wcc/purchase' },
  { key: 'entry', label: '入库确认', icon: '🏠', color: '#FF9500', route: '/wcc/entry' },
  { key: 'sales', label: '车辆销售', icon: '💰', color: '#34C759', route: '/wcc/sales' },
  { key: 'approval', label: '审批', icon: '👤', color: '#8E8E93', route: '/wcc/approval' },
  { key: 'auction', label: '车辆委拍', icon: '🔨', color: '#007AFF', route: '/wcc/auction' },
  { key: 'pledge', label: '质押车管理', icon: '🔒', color: '#FF3B30', route: '/wcc/pledge' },
]

/** 唯车城首页 — 蓝色主题，6功能入口 + 底部TabBar */
export default function WccHome() {
  const navigate = useNavigate()

  return (
    <div className="wcc-page" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
      <div className="wcc-nav">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">唯普智慧车城</div>
        <div className="nav-right" style={{ fontSize: 20 }}>···</div>
      </div>

      {/* Banner */}
      <div style={{
        margin: '12px 16px', borderRadius: 16, padding: '20px 24px',
        background: 'linear-gradient(135deg, #E8F0FE 0%, #D4E4FD 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#4080FF', lineHeight: 1.5 }}>
            唯普汽车<br/>打造高效经销服务
          </div>
          <div style={{ fontSize: 11, color: '#4080FF99', marginTop: 6 }}>
            合规经营管理、智慧库管、营销<br/>获客、产品定制等多维度服务
          </div>
        </div>
        {/* 装饰图 */}
        <div style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          opacity: 0.2, fontSize: 60,
        }}>🚙</div>
      </div>

      {/* 功能入口 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0, padding: '8px 16px 20px',
      }}>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => navigate(item.route)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${item.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 6,
            }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 底部TabBar */}
      <div className="wcc-tabbar">
        <button className="wcc-tabbar-item active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 0 0 .7-1.7l-9-9a1 1 0 0 0-1.4 0l-9 9A1 1 0 0 0 3 13z"/></svg>
          <span>首页</span>
        </button>
        <button className="wcc-tabbar-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>消息</span>
        </button>
        <button className="wcc-tabbar-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>我的</span>
        </button>
      </div>
    </div>
  )
}
