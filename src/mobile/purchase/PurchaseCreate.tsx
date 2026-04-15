import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PurchaseMode, VehicleItem, OwnerInfo, PaymentInfo } from '@shared/types'
import { PURCHASE_FORM_STEPS } from '@shared/constants'
import VehicleInfoStep from './VehicleInfoStep'
import PaymentInfoStep from './PaymentInfoStep'

/** 采购创建页 — 2步表单（车辆信息+车况 → 收款信息+签名） */
export default function PurchaseCreate() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [mode, setMode] = useState<PurchaseMode>('single')

  // Step1: 车辆列表（单车=1台，批量=N台，每台含车况）
  const [vehicles, setVehicles] = useState<Partial<VehicleItem>[]>([createEmptyVehicle()])
  // 批量模式：当前编辑的车辆索引
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0)

  // Step2: 车主 + 收款
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({ ownerType: '个人' } as Partial<OwnerInfo>)
  const [paymentInfo, setPaymentInfo] = useState<Partial<PaymentInfo>>({} as Partial<PaymentInfo>)
  const [signatureUrl, setSignatureUrl] = useState('')

  const handleModeSwitch = useCallback((newMode: PurchaseMode) => {
    setMode(newMode)
    if (newMode === 'single') {
      setVehicles([vehicles[0] || createEmptyVehicle()])
      setActiveVehicleIndex(0)
    }
  }, [vehicles])

  const handleAddVehicle = useCallback(() => {
    setVehicles(prev => [...prev, createEmptyVehicle()])
    setActiveVehicleIndex(vehicles.length)
  }, [vehicles.length])

  const handleRemoveVehicle = useCallback((index: number) => {
    if (vehicles.length <= 1) return
    setVehicles(prev => prev.filter((_, i) => i !== index))
    setActiveVehicleIndex(prev => Math.min(prev, vehicles.length - 2))
  }, [vehicles.length])

  const handleUpdateVehicle = useCallback((index: number, data: Partial<VehicleItem>) => {
    setVehicles(prev => prev.map((v, i) => i === index ? { ...v, ...data } : v))
  }, [])

  const handleNextStep = () => {
    if (currentStep < PURCHASE_FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    // TODO: 校验 + 提交
    navigate('/purchase/success', { state: { mode, vehicleCount: vehicles.length } })
  }

  return (
    <div className="page page-bottom">
      {/* 导航栏 */}
      <div className="nav-brand">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-title">车辆采购申请</div>
        <div className="nav-right" />
      </div>

      {/* 步骤指示器 */}
      <div className="steps">
        {PURCHASE_FORM_STEPS.map((step, i) => (
          <div className="step" key={step.index}>
            {i > 0 && <div className={`step-line ${i <= currentStep ? 'done' : ''}`} />}
            <div className={`step-dot ${i === currentStep ? 'active' : i < currentStep ? 'done' : 'pending'}`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <div className={`step-label ${i === currentStep ? 'active' : ''}`}>{step.label}</div>
          </div>
        ))}
      </div>

      {/* 表单内容 */}
      {currentStep === 0 && (
        <VehicleInfoStep
          mode={mode}
          vehicles={vehicles}
          activeIndex={activeVehicleIndex}
          onModeSwitch={handleModeSwitch}
          onActiveIndexChange={setActiveVehicleIndex}
          onUpdateVehicle={handleUpdateVehicle}
          onAddVehicle={handleAddVehicle}
          onRemoveVehicle={handleRemoveVehicle}
        />
      )}

      {currentStep === 1 && (
        <PaymentInfoStep
          ownerInfo={ownerInfo}
          paymentInfo={paymentInfo}
          signatureUrl={signatureUrl}
          onOwnerInfoChange={setOwnerInfo}
          onPaymentInfoChange={setPaymentInfo}
          onSignatureChange={setSignatureUrl}
        />
      )}

      {/* 底部操作栏 */}
      <div className="bottom-bar">
        {currentStep > 0 && (
          <button className="btn-secondary" onClick={handlePrevStep} style={{ flex: 1 }}>
            上一步
          </button>
        )}
        {currentStep < PURCHASE_FORM_STEPS.length - 1 ? (
          <button className="btn-primary" onClick={handleNextStep} style={{ flex: 1 }}>
            下一步
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
            提 交
          </button>
        )}
      </div>
    </div>
  )
}

function createEmptyVehicle(): Partial<VehicleItem> {
  return {
    drivingLicensePhotos: [],
    registrationCertPhotos: [],
    photos: [],
    odometerStatus: '正常',
    collision: '正常',
    waterDamage: '正常',
    fireDamage: '正常',
    maintenanceReport: '无',
    maintenanceReportPhotos: [],
  }
}
