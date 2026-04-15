import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

/** 采购审批详情页 — 门店负责人审批 */
export default function PurchaseApprovalDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [opinion, setOpinion] = useState('')
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | null>(null)

  // Mock: 判断是否为批量
  const isBatch = id === 'AP-002'
  const vehicles = isBatch
    ? [
        { brandModel: '大众帕萨特新能源2019款', plateNo: '粤A111111', mileage: 3.3, purchasePrice: 20000, collision: '正常', waterDamage: '正常', fireDamage: '正常' },
        { brandModel: '丰田凯美瑞2023款 2.5L', plateNo: '粤B222222', mileage: 2.1, purchasePrice: 25000, collision: '正常', waterDamage: '正常', fireDamage: '正常' },
        { brandModel: '本田雅阁2022款 260T', plateNo: '粤A333333', mileage: 4.5, purchasePrice: 15000, collision: '损伤覆盖件', waterDamage: '正常', fireDamage: '正常' },
      ]
    : [
        { brandModel: '大众帕萨特新能源2019款1.4T混动豪华版', plateNo: '粤A123456', mileage: 3.3, purchasePrice: 20000, collision: '正常', waterDamage: '正常', fireDamage: '正常' },
      ]

  const handleAction = (action: 'approve' | 'reject') => {
    // TODO: 调用API
    setShowConfirm(null)
    navigate('/approval/purchase', { replace: true })
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">采购审批详情</div>
        <div className="nav-right" />
      </div>

      {/* 申请信息 */}
      <div className="card-glass anim" style={{ margin: '12px 16px', padding: 14 }}>
        <InfoRow label="申请人" value="张先生" />
        <InfoRow label="申请时间" value="2023-09-20 10:00" />
        <InfoRow label="门店" value="天河旗舰店" />
        <InfoRow label="采购模式" value={isBatch ? `批量采购（${vehicles.length}台）` : '单车采购'} />
      </div>

      {/* 车辆明细 */}
      <div className="section-hd">车辆明细</div>
      {vehicles.map((v, i) => (
        <div key={i} className={`card-glass anim d${Math.min(i + 1, 5)}`} style={{ margin: '0 16px 10px', padding: 14 }}>
          {isBatch && (
            <div style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, marginBottom: 8 }}>
              第{i + 1}台 / 共{vehicles.length}台
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <img
              src={getCarImage(i)}
              onError={e => { (e.target as HTMLImageElement).src = CAR_PLACEHOLDER }}
              alt={v.brandModel}
              style={{ width: 80, height: 56, borderRadius: 8, flexShrink: 0, objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{v.brandModel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                {v.plateNo} | {v.mileage}万公里
              </div>
            </div>
          </div>
          <InfoRow label="采购价格" value={`¥${v.purchasePrice.toLocaleString()}`} highlight />
          <InfoRow label="碰撞" value={v.collision} warn={v.collision !== '正常'} />
          <InfoRow label="水泡" value={v.waterDamage} warn={v.waterDamage !== '正常'} />
          <InfoRow label="火烧" value={v.fireDamage} warn={v.fireDamage !== '正常'} />
        </div>
      ))}

      {/* 合计 */}
      {isBatch && (
        <div className="card-glass" style={{ margin: '0 16px 12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--text-2)' }}>合计（{vehicles.length}台）</span>
          <span className="price" style={{ fontSize: 18 }}>
            ¥{vehicles.reduce((s, v) => s + v.purchasePrice, 0).toLocaleString()}
          </span>
        </div>
      )}

      {/* 审批意见 */}
      <div className="card-glass" style={{ margin: '0 16px 12px', padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>审批意见</div>
        <textarea
          value={opinion}
          onChange={e => setOpinion(e.target.value.slice(0, 100))}
          placeholder="请输入审批意见（选填）"
          maxLength={100}
          rows={3}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, resize: 'none',
            border: '1px solid var(--border-strong)', fontSize: 14, background: 'var(--bg-warm)',
            outline: 'none',
          }}
        />
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-3)' }}>{opinion.length}/100</div>
      </div>

      {/* 底部操作栏 */}
      <div className="bottom-bar" style={{ gap: 10 }}>
        <button
          onClick={() => setShowConfirm('reject')}
          style={{
            flex: 1, padding: 14, borderRadius: 12, border: '1.5px solid var(--red)',
            background: 'none', fontSize: 16, fontWeight: 600, color: 'var(--red)', cursor: 'pointer',
          }}
        >
          审批驳回
        </button>
        <button className="btn-primary" onClick={() => setShowConfirm('approve')} style={{ flex: 1 }}>
          审批通过
        </button>
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <>
          <div className="overlay" onClick={() => setShowConfirm(null)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, background: 'var(--surface)', borderRadius: '20px 20px 0 0',
            padding: '24px 20px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            zIndex: 200,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {showConfirm === 'approve' ? '确认通过？' : '确认驳回？'}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8 }}>
                {showConfirm === 'approve'
                  ? `通过后将流转至经销公司审批${isBatch ? `（共${vehicles.length}台车辆）` : ''}`
                  : '驳回后车商需重新发起采购申请'
                }
              </p>
              {opinion && (
                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--bg)', fontSize: 13, color: 'var(--text-1)', textAlign: 'left' }}>
                  审批意见：{opinion}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setShowConfirm(null)} style={{ flex: 1 }}>
                再想想
              </button>
              <button
                className="btn-primary"
                onClick={() => handleAction(showConfirm)}
                style={{
                  flex: 1,
                  background: showConfirm === 'reject' ? 'var(--red)' : 'var(--brand)',
                  boxShadow: showConfirm === 'reject' ? '0 4px 12px rgba(255,59,48,0.2)' : undefined,
                }}
              >
                {showConfirm === 'approve' ? '确认通过' : '确认驳回'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function InfoRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{
        fontSize: 14, fontWeight: highlight ? 700 : 400,
        color: highlight ? 'var(--brand)' : warn ? 'var(--red)' : 'var(--text-0)',
      }}>{value}</span>
    </div>
  )
}
