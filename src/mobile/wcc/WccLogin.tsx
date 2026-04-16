import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './wcc.css'

/** 唯车城登录页 — 蓝色主题，账号密码登录 */
export default function WccLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const canSubmit = username.length > 0 && password.length > 0

  const handleLogin = () => {
    // TODO: 调用登录API
    navigate('/wcc/home')
  }

  return (
    <div className="wcc-page">
      <div className="wcc-nav">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">登录</div>
        <div className="nav-right" />
      </div>

      {/* Banner图 */}
      <div style={{
        height: 160, background: 'linear-gradient(135deg, #E8F0FE 0%, #D4E4FD 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, color: '#4080FF30',
      }}>
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <rect x="5" y="20" width="70" height="30" rx="6" fill="#4080FF" opacity="0.15"/>
          <rect x="15" y="10" width="50" height="35" rx="4" fill="#4080FF" opacity="0.25"/>
          <circle cx="30" cy="50" r="6" fill="#4080FF" opacity="0.3"/>
          <circle cx="55" cy="50" r="6" fill="#4080FF" opacity="0.3"/>
        </svg>
      </div>

      <div style={{ padding: '32px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>登录账号</h2>

        {/* 账号 */}
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="请输入您的账号"
          style={{
            width: '100%', padding: '14px 0', border: 'none', borderBottom: '1px solid var(--border-strong)',
            fontSize: 16, outline: 'none', background: 'none', color: 'var(--text-0)',
          }}
        />

        {/* 密码 */}
        <div style={{ position: 'relative', marginTop: 8 }}>
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="请输入密码"
            style={{
              width: '100%', padding: '14px 40px 14px 0', border: 'none', borderBottom: '1px solid var(--border-strong)',
              fontSize: 16, outline: 'none', background: 'none', color: 'var(--text-0)',
            }}
          />
          <button
            onClick={() => setShowPwd(!showPwd)}
            style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text-2)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {showPwd ? (
                <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              ) : (
                <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
              )}
            </svg>
          </button>
        </div>

        {/* 登录按钮 */}
        <button
          className="wcc-btn-primary"
          onClick={handleLogin}
          disabled={!canSubmit}
          style={{
            marginTop: 32,
            opacity: canSubmit ? 1 : 0.5,
          }}
        >
          登录
        </button>
      </div>
    </div>
  )
}
