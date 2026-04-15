import type { OwnerInfo, PaymentInfo, OwnerType, PayeeIdentity, SoleProprietorBankCardType, SoleProprietorAccountType } from '@shared/types'
import {
  OWNER_TYPE_OPTIONS,
  PAYEE_IDENTITY_OPTIONS,
  SOLE_PROPRIETOR_BANK_CARD_TYPES,
  SOLE_PROPRIETOR_ACCOUNT_TYPES,
} from '@shared/constants'

interface Props {
  ownerInfo: Partial<OwnerInfo>
  paymentInfo: Partial<PaymentInfo>
  signatureUrl: string
  onOwnerInfoChange: (info: Partial<OwnerInfo>) => void
  onPaymentInfoChange: (info: Partial<PaymentInfo>) => void
  onSignatureChange: (url: string) => void
}

/**
 * Step2: 收款信息 + 签名
 * 车主类型（个人/企业/个体工商户）决定不同字段
 * 收款人身份（车主/非车主）决定是否自动带入
 */
export default function PaymentInfoStep({
  ownerInfo, paymentInfo, signatureUrl,
  onOwnerInfoChange, onPaymentInfoChange, onSignatureChange,
}: Props) {
  const ownerType = (ownerInfo as { ownerType?: OwnerType }).ownerType || '个人'

  const setOwnerType = (type: OwnerType) => {
    onOwnerInfoChange({ ownerType: type } as Partial<OwnerInfo>)
    onPaymentInfoChange({ ownerType: type } as Partial<PaymentInfo>)
  }

  return (
    <div style={{ padding: '0 0 16px' }}>
      {/* ===== 车主信息 ===== */}
      <SectionCard title="车主信息">
        <FieldRow label="车主类型" required>
          <div style={{ display: 'flex', gap: 8 }}>
            {OWNER_TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setOwnerType(opt.value)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: ownerType === opt.value ? 'var(--brand-bg-strong)' : 'rgba(0,0,0,0.04)',
                  color: ownerType === opt.value ? 'var(--brand)' : 'var(--text-1)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FieldRow>

        {/* 个人 */}
        {ownerType === '个人' && (
          <>
            <FieldRow label="身份证照片" required>
              <div className="upload-area" style={{ minHeight: 80 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传身份证正反面</div>
              </div>
            </FieldRow>
            <FieldRow label="车主姓名" required>
              <input
                value={(ownerInfo as any).ownerName || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, ownerName: e.target.value } as any)}
                placeholder="OCR识别或手动输入"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="身份证号" required>
              <input
                value={(ownerInfo as any).idNo || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, idNo: e.target.value } as any)}
                placeholder="18位身份证号"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="联系电话" required>
              <input
                type="tel"
                value={(ownerInfo as any).phone || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, phone: e.target.value } as any)}
                placeholder="11位手机号"
                style={inputStyle}
              />
            </FieldRow>
          </>
        )}

        {/* 企业 */}
        {ownerType === '企业' && (
          <>
            <FieldRow label="营业执照" required>
              <div className="upload-area" style={{ minHeight: 80 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传营业执照</div>
              </div>
            </FieldRow>
            <FieldRow label="证件类型" required>
              <select
                value={(ownerInfo as any).certType || '统一社会信用代码'}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, certType: e.target.value } as any)}
                style={inputStyle}
              >
                <option value="统一社会信用代码">统一社会信用代码</option>
                <option value="组织机构代码">组织机构代码</option>
              </select>
            </FieldRow>
            <FieldRow label="企业名称" required>
              <input
                value={(ownerInfo as any).companyName || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, companyName: e.target.value } as any)}
                placeholder="请输入企业名称"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="证件号码" required>
              <input
                value={(ownerInfo as any).certNo || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, certNo: e.target.value } as any)}
                placeholder="请输入信用代码/机构代码"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="联系电话" required>
              <input
                type="tel"
                value={(ownerInfo as any).phone || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, phone: e.target.value } as any)}
                placeholder="11位手机号"
                style={inputStyle}
              />
            </FieldRow>
          </>
        )}

        {/* 个体工商户 */}
        {ownerType === '个体工商户' && (
          <>
            <FieldRow label="法人身份证" required>
              <div className="upload-area" style={{ minHeight: 80 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传法人身份证正反面</div>
              </div>
            </FieldRow>
            <FieldRow label="营业执照" required>
              <div className="upload-area" style={{ minHeight: 80 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传营业执照/组织机构代码证</div>
              </div>
            </FieldRow>
            <FieldRow label="企业名称" required>
              <input
                value={(ownerInfo as any).businessName || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, businessName: e.target.value } as any)}
                placeholder="请输入企业名称"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="证件号码" required>
              <input
                value={(ownerInfo as any).certNo || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, certNo: e.target.value } as any)}
                placeholder="统一社会信用代码/组织机构代码"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="法人姓名" required>
              <input
                value={(ownerInfo as any).legalRepName || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, legalRepName: e.target.value } as any)}
                placeholder="请输入法人姓名"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="法人身份证号" required>
              <input
                value={(ownerInfo as any).legalRepIdNo || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, legalRepIdNo: e.target.value } as any)}
                placeholder="18位身份证号"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="联系电话" required>
              <input
                type="tel"
                value={(ownerInfo as any).phone || ''}
                onChange={e => onOwnerInfoChange({ ...ownerInfo, phone: e.target.value } as any)}
                placeholder="11位手机号"
                style={inputStyle}
              />
            </FieldRow>
          </>
        )}
      </SectionCard>

      {/* ===== 收款信息 ===== */}
      <SectionCard title="收款信息">
        <FieldRow label="收款人身份" required>
          <div style={{ display: 'flex', gap: 8 }}>
            {PAYEE_IDENTITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onPaymentInfoChange({ ...paymentInfo, payeeIdentity: opt.value } as any)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: (paymentInfo as any).payeeIdentity === opt.value ? 'var(--brand-bg-strong)' : 'rgba(0,0,0,0.04)',
                  color: (paymentInfo as any).payeeIdentity === opt.value ? 'var(--brand)' : 'var(--text-1)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FieldRow>

        {/* 收款人身份=车主时的提示 */}
        {(paymentInfo as any).payeeIdentity === '车主' && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--green-bg)', color: 'var(--green)', fontSize: 12, marginBottom: 12 }}>
            ✓ 收款人信息自动带入车主信息
          </div>
        )}

        {/* 开户名 */}
        <FieldRow label="开户名" required>
          <input
            value={(paymentInfo as any).payeeName || ''}
            onChange={e => onPaymentInfoChange({ ...paymentInfo, payeeName: e.target.value } as any)}
            placeholder={(paymentInfo as any).payeeIdentity === '车主' ? '自动带入（不可修改）' : '请输入收款人姓名'}
            readOnly={(paymentInfo as any).payeeIdentity === '车主'}
            style={{ ...inputStyle, background: (paymentInfo as any).payeeIdentity === '车主' ? 'rgba(0,0,0,0.02)' : 'var(--bg-warm)' }}
          />
        </FieldRow>

        {/* 个体工商户：银行卡类型二级选择 */}
        {ownerType === '个体工商户' && (
          <>
            <FieldRow label="银行卡类型" required>
              <div style={{ display: 'flex', gap: 8 }}>
                {SOLE_PROPRIETOR_BANK_CARD_TYPES.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onPaymentInfoChange({ ...paymentInfo, bankCardType: opt.value } as any)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: (paymentInfo as any).bankCardType === opt.value ? 'var(--blue-bg)' : 'rgba(0,0,0,0.04)',
                      color: (paymentInfo as any).bankCardType === opt.value ? 'var(--blue)' : 'var(--text-1)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FieldRow>
            {(paymentInfo as any).bankCardType && (
              <FieldRow label="账户类型" required>
                <div style={{ display: 'flex', gap: 8 }}>
                  {SOLE_PROPRIETOR_ACCOUNT_TYPES[(paymentInfo as any).bankCardType as SoleProprietorBankCardType]?.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => onPaymentInfoChange({ ...paymentInfo, accountType: opt.value } as any)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        background: (paymentInfo as any).accountType === opt.value ? 'var(--blue-bg)' : 'rgba(0,0,0,0.04)',
                        color: (paymentInfo as any).accountType === opt.value ? 'var(--blue)' : 'var(--text-1)',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldRow>
            )}
            <FieldRow label="银行卡照片">
              <div className="upload-area" style={{ minHeight: 80 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传银行卡正反面</div>
              </div>
            </FieldRow>
          </>
        )}

        {/* 企业：对公账号 */}
        {ownerType === '企业' ? (
          <>
            <FieldRow label="对公账号" required>
              <input
                value={(paymentInfo as any).corporateAccount || ''}
                onChange={e => onPaymentInfoChange({ ...paymentInfo, corporateAccount: e.target.value } as any)}
                placeholder="请输入对公账号"
                style={inputStyle}
              />
            </FieldRow>
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--blue-bg)', color: 'var(--blue)', fontSize: 12, marginBottom: 12 }}>
              ℹ️ 系统会自动向该对公账户转入0.01元用于验证账号有效性
            </div>
          </>
        ) : (
          <FieldRow label="银行卡号" required>
            <input
              value={(paymentInfo as any).bankCardNo || ''}
              onChange={e => onPaymentInfoChange({ ...paymentInfo, bankCardNo: e.target.value } as any)}
              placeholder="请输入银行卡号"
              style={inputStyle}
            />
          </FieldRow>
        )}

        <FieldRow label="所属银行" required>
          <input
            value={(paymentInfo as any).bankName || ''}
            onChange={e => onPaymentInfoChange({ ...paymentInfo, bankName: e.target.value } as any)}
            placeholder="请选择开户行"
            style={inputStyle}
          />
        </FieldRow>

        {/* 预留手机号（个人始终显示；个体工商户仅法人名下银行卡时显示；企业不显示） */}
        {(ownerType === '个人' || (ownerType === '个体工商户' && (paymentInfo as any).bankCardType === '法人名下银行卡')) && (
          <FieldRow label="预留手机号" required>
            <input
              type="tel"
              value={(paymentInfo as any).reservedPhone || ''}
              onChange={e => onPaymentInfoChange({ ...paymentInfo, reservedPhone: e.target.value } as any)}
              placeholder="银行预留手机号"
              style={inputStyle}
            />
          </FieldRow>
        )}
      </SectionCard>

      {/* ===== 签名确认 ===== */}
      <SectionCard title="签名确认">
        <div className="signature-box">
          {signatureUrl ? (
            <img src={signatureUrl} alt="签名" style={{ maxHeight: '100%' }} />
          ) : (
            <span>点击此处签名</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center', marginTop: 8 }}>
          点击"提交"代表您与车辆委托方均已确认上述信息真实有效
        </div>
      </SectionCard>
    </div>
  )
}

// ==========================================
// 内部子组件
// ==========================================

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass anim" style={{ margin: '0 16px 12px', padding: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
        {required && <span style={{ color: 'var(--red)' }}>* </span>}
        {label}
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--border-strong)', fontSize: 14,
  background: 'var(--bg-warm)', color: 'var(--text-0)',
  outline: 'none',
}
