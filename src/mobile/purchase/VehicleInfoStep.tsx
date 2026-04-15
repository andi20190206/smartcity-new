import type { PurchaseMode, VehicleItem } from '@shared/types'
import {
  COLLISION_OPTIONS,
  WATER_DAMAGE_OPTIONS,
  FIRE_DAMAGE_OPTIONS,
  VEHICLE_PHOTO_TYPES,
} from '@shared/constants'

interface Props {
  mode: PurchaseMode
  vehicles: Partial<VehicleItem>[]
  activeIndex: number
  onModeSwitch: (mode: PurchaseMode) => void
  onActiveIndexChange: (index: number) => void
  onUpdateVehicle: (index: number, data: Partial<VehicleItem>) => void
  onAddVehicle: () => void
  onRemoveVehicle: (index: number) => void
}

/**
 * Step1: 车辆信息 + 车况（合并）
 * - 单车模式：一次填完
 * - 批量模式：顶部切换"第X台/共N台"，每台独立车况
 */
export default function VehicleInfoStep({
  mode, vehicles, activeIndex,
  onModeSwitch, onActiveIndexChange, onUpdateVehicle, onAddVehicle, onRemoveVehicle,
}: Props) {
  const v = vehicles[activeIndex] || {}

  const updateField = <K extends keyof VehicleItem>(field: K, value: VehicleItem[K]) => {
    onUpdateVehicle(activeIndex, { [field]: value } as Partial<VehicleItem>)
  }

  return (
    <div style={{ padding: '0 0 16px' }}>
      {/* 模式切换 */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
        <ModeTab active={mode === 'single'} onClick={() => onModeSwitch('single')}>单车采购</ModeTab>
        <ModeTab active={mode === 'batch'} onClick={() => onModeSwitch('batch')}>批量采购</ModeTab>
      </div>

      {/* 批量模式：车辆切换器 */}
      {mode === 'batch' && (
        <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {vehicles.map((_, i) => (
            <button
              key={i}
              onClick={() => onActiveIndexChange(i)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: i === activeIndex ? 'var(--brand)' : 'rgba(0,0,0,0.04)',
                color: i === activeIndex ? '#fff' : 'var(--text-1)',
              }}
            >
              第{i + 1}台
              {vehicles.length > 1 && i === activeIndex && (
                <span onClick={(e) => { e.stopPropagation(); onRemoveVehicle(i) }} style={{ marginLeft: 6, opacity: 0.7 }}>✕</span>
              )}
            </button>
          ))}
          <button onClick={onAddVehicle} style={{
            padding: '6px 14px', borderRadius: 8, border: '1.5px dashed var(--text-3)',
            background: 'none', fontSize: 13, color: 'var(--text-2)', cursor: 'pointer',
          }}>
            + 添加
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-2)', marginLeft: 'auto' }}>
            共{vehicles.length}台
          </span>
        </div>
      )}

      {/* ===== 证件上传 ===== */}
      <SectionCard title="证件信息">
        <FieldRow label="行驶证" required>
          <div className="upload-area" style={{ minHeight: 80 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {v.drivingLicensePhotos?.length ? `已上传 ${v.drivingLicensePhotos.length} 张` : '上传行驶证（主页+副页）'}
            </div>
          </div>
        </FieldRow>
        <FieldRow label="登记证">
          <div className="upload-area" style={{ minHeight: 80 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {v.registrationCertPhotos?.length ? `已上传 ${v.registrationCertPhotos.length} 张` : '上传登记证（1-4页）'}
            </div>
          </div>
        </FieldRow>
      </SectionCard>

      {/* ===== 车辆基础信息 ===== */}
      <SectionCard title="车辆基础信息">
        <FieldRow label="VIN码" required>
          <input
            value={v.vin || ''}
            onChange={e => updateField('vin', e.target.value.toUpperCase())}
            placeholder="行驶证OCR识别或手动输入"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="车牌">
          <input
            value={v.plateNo || ''}
            onChange={e => updateField('plateNo', e.target.value)}
            placeholder="选填"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="品牌车型" required>
          <input
            value={v.brandModel || ''}
            onChange={e => updateField('brandModel', e.target.value)}
            placeholder="OCR识别或手动选择"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="里程表状态">
          <div style={{ display: 'flex', gap: 12 }}>
            {(['正常', '故障'] as const).map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--text-1)' }}>
                <input type="radio" checked={v.odometerStatus === s} onChange={() => updateField('odometerStatus', s)} />
                {s}
              </label>
            ))}
          </div>
        </FieldRow>
        <FieldRow label="表显里程" required>
          <input
            type="number"
            value={v.mileage ?? ''}
            onChange={e => updateField('mileage', Number(e.target.value))}
            placeholder="万公里"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="年审有效期" required>
          <input
            type="date"
            value={v.annualInspection || ''}
            onChange={e => updateField('annualInspection', e.target.value)}
            style={inputStyle}
          />
        </FieldRow>
      </SectionCard>

      {/* ===== 车况信息（原Step2，合并到此） ===== */}
      <SectionCard title="车况信息">
        {/* 车辆照片 */}
        <div style={{ padding: '0 0 12px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
            车辆照片 <span style={{ color: 'var(--blue)', fontSize: 11 }}>蓝色标记为必传</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {VEHICLE_PHOTO_TYPES.map(pt => (
              <div key={pt.type} className="upload-area" style={{ minHeight: 70, padding: 10 }}>
                <div style={{ fontSize: 11, color: pt.required ? 'var(--blue)' : 'var(--text-2)', fontWeight: pt.required ? 600 : 400 }}>
                  {pt.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 三大项 */}
        <FieldRow label="碰撞" required>
          <select
            value={v.collision || '正常'}
            onChange={e => updateField('collision', e.target.value as VehicleItem['collision'])}
            style={inputStyle}
          >
            {COLLISION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FieldRow>
        <FieldRow label="水泡" required>
          <select
            value={v.waterDamage || '正常'}
            onChange={e => updateField('waterDamage', e.target.value as VehicleItem['waterDamage'])}
            style={inputStyle}
          >
            {WATER_DAMAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FieldRow>
        <FieldRow label="火烧" required>
          <select
            value={v.fireDamage || '正常'}
            onChange={e => updateField('fireDamage', e.target.value as VehicleItem['fireDamage'])}
            style={inputStyle}
          >
            {FIRE_DAMAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FieldRow>

        {/* 车况描述 */}
        <FieldRow label="其他描述">
          <textarea
            value={v.conditionDesc || ''}
            onChange={e => updateField('conditionDesc', e.target.value.slice(0, 200))}
            placeholder="输入车辆情况的描述信息"
            maxLength={200}
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
          />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-3)' }}>
            {(v.conditionDesc || '').length}/200
          </div>
        </FieldRow>

        {/* 维保报告 */}
        <FieldRow label="维保报告">
          <div style={{ display: 'flex', gap: 12 }}>
            {(['有', '无'] as const).map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--text-1)' }}>
                <input type="radio" checked={v.maintenanceReport === s} onChange={() => updateField('maintenanceReport', s)} />
                {s}
              </label>
            ))}
          </div>
        </FieldRow>
        {v.maintenanceReport === '有' && (
          <div className="upload-area" style={{ margin: '0 0 12px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>上传维保报告（1-8张）</div>
          </div>
        )}
      </SectionCard>

      {/* ===== 采购价格 & 交车信息 ===== */}
      <SectionCard title="采购价格与交车">
        <FieldRow label="采购价格" required>
          <input
            type="number"
            value={v.purchasePrice ?? ''}
            onChange={e => updateField('purchasePrice', Number(e.target.value))}
            placeholder="元"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="交车时间" required>
          <input
            type="datetime-local"
            value={v.deliveryTime || ''}
            onChange={e => updateField('deliveryTime', e.target.value)}
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="交车地点" required>
          <input
            value={v.deliveryLocation || ''}
            onChange={e => updateField('deliveryLocation', e.target.value)}
            placeholder="默认车商仓库地址"
            style={inputStyle}
          />
        </FieldRow>
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

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      background: active ? 'var(--brand)' : 'rgba(0,0,0,0.04)',
      color: active ? '#fff' : 'var(--text-1)',
      transition: 'all 0.2s',
    }}>
      {children}
    </button>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--border-strong)', fontSize: 14,
  background: 'var(--bg-warm)', color: 'var(--text-0)',
  outline: 'none',
}
