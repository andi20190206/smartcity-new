import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCarImage, CAR_PLACEHOLDER } from '@shared/constants'

/** 销售审批详情页 */
export default function SalesApprovalDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [opinion, setOpinion] = useState('')
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | null>(null)

  const isBatch = id === 'SA-002'
  const vehicles = isBatch
    ? [
        { brandModel: '大众 帕萨特 2019款 1.4T 智能版', plateNo: '粤A111111', mileage: 3.3, contractPrice: 90000, salesPrice: 120000 },
        { brandModel: '丰田 凯美瑞 2023款 2.5L 豪华版', plateNo: '粤B222222', mileage: 1.8, contractPrice: 100000, salesPrice: 120000 },
      ]
    : [
        { brandModel: '福特 Ranger 2018款 福特Range 3.2TDCi', plateNo: '粤A123456', mileage: 3, contractPrice: 7000, salesPrice: 20000 },
      ]

  const buyer = { name: '范怜', phone: '13403957900', idNo: '611021199612259046', bankCardNo: '6230580100009272884', bankName: '中国银行' }

  const totalSales = vehicles.reduce((s, v) => s + v.salesPrice, 0)
  const totalContract = vehicles.reduce((s, v) => s + v.contractPrice, 0)
  const profit = totalSales - totalContract

  const handleAction = (_action: 'approve' | 'reject') => {
    setShowConfirm(null)
    navigate('/approval/sales', { replace: true })
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">销售审批详情</div>
        <div className="nav-right" />
      </div>

      {/* 申请信息 */}
      <div className="card-glass anim" style={{ margin: '12px 16px', padding: 14 }}>
        <InfoRow label="申请人" value="张先生" />
        <InfoRow label="申请时间" value="2023-09-20 10:00" />
        <InfoRow label="门店" value="天河旗舰店" />
        <InfoRow label="销售模式" value={isBatch ? `批量销售（${vehicles.length}台）` : '单车销售'} />
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
          <InfoRow label="采购合同价" value={`¥${v.contractPrice.toLocaleString()}`} />
          <InfoRow label="销售价" value={`¥${v.salesPrice.toLocaleString()}`} highlight />
          <InfoRow
            label="盈亏"
            value={`${v.salesPrice >= v.contractPrice ? '+' : ''}¥${(v.salesPrice - v.contractPrice).toLocaleString()}`}
            profit={v.salesPrice >= v.contractPrice}
          />
        </div>
      ))}

      {/* 合计（批量） */}
      {isBatch && (
        <div className="card-glass" style={{ margin: '0 16px 12px', padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span style={{ fontSize: 14, color: 'var(--text-2)' }}>销售合计（{vehicles.length}台）</span>
            <span className="price" style={{ fontSize: 18 }}>¥{totalSales.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>采购合计</span>
            <span style={{ fontSize: 14, color: 'var(--text-1)' }}>¥{totalContract.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>盈亏</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {profit >= 0 ? '+' : ''}¥{profit.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* 买家信息 */}
      <div className="card-glass" style={{ margin: '0 16px 12px', padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>买家信息</div>
        <InfoRow label="姓名" value={buyer.name} />
        <InfoRow label="手机" value={buyer.phone} />
        <InfoRow label="身份证" value={buyer.idNo} />
        <InfoRow label="银行卡" value={buyer.bankCardNo} />
        <InfoRow label="开户行" value={buyer.bankName} />
      </div>

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

      {/* 操作栏 */}
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
                  : '驳回后车商需重新发起销售签约'
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

function InfoRow({ label, value, highlight, profit }: { label: string; value: string; highlight?: boolean; profit?: boolean }) {
  const color = profit !== undefined ? (profit ? 'var(--green)' : 'var(--red)') : highlight ? 'var(--brand)' : 'var(--text-0)'
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: highlight || profit !== undefined ? 700 : 400, color }}>{value}</span>
    </div>
  )
}
