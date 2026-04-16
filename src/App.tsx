import { Routes, Route, Navigate } from 'react-router-dom'
import PurchaseCreate from '@mobile/purchase/PurchaseCreate'
import PurchaseList from '@mobile/purchase/PurchaseList'
import PurchaseDetail from '@mobile/purchase/PurchaseDetail'
import PurchaseSuccess from '@mobile/purchase/PurchaseSuccess'
import ApprovalHub from '@mobile/approval/ApprovalHub'
import PurchaseApprovalList from '@mobile/approval/PurchaseApprovalList'
import PurchaseApprovalDetail from '@mobile/approval/PurchaseApprovalDetail'
import WccLogin from '@mobile/wcc/WccLogin'
import WccHome from '@mobile/wcc/WccHome'
import WccPurchaseList from '@mobile/wcc/WccPurchaseList'
import WccPurchaseDetail from '@mobile/wcc/WccPurchaseDetail'

// 临时占位组件 — 等截图后替换为真实页面
function Placeholder({ name }: { name: string }) {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-2)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{name}</h2>
        <p>页面开发中...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* 默认跳转到唯车帮首页 */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ===== 唯车帮（车商端） ===== */}
      <Route path="/home" element={<Placeholder name="首页" />} />
      <Route path="/login" element={<Placeholder name="登录" />} />

      {/* 采购 */}
      <Route path="/purchase" element={<PurchaseList />} />
      <Route path="/purchase/create" element={<PurchaseCreate />} />
      <Route path="/purchase/detail/:id" element={<PurchaseDetail />} />
      <Route path="/purchase/success" element={<PurchaseSuccess />} />
      <Route path="/purchase/batch-import" element={<Placeholder name="批量导入" />} />

      {/* 销售 */}
      <Route path="/sales" element={<Placeholder name="销售列表" />} />
      <Route path="/sales/create" element={<Placeholder name="发起销售" />} />
      <Route path="/sales/detail/:id" element={<Placeholder name="销售详情" />} />

      {/* 资金 */}
      <Route path="/fund" element={<Placeholder name="资金管理" />} />
      <Route path="/fund/advance/:id" element={<Placeholder name="垫款详情" />} />

      {/* 库存 */}
      <Route path="/inventory" element={<Placeholder name="库存管理" />} />
      <Route path="/inventory/:id" element={<Placeholder name="库存详情" />} />

      {/* 合同 */}
      <Route path="/contract" element={<Placeholder name="合同列表" />} />
      <Route path="/contract/:id" element={<Placeholder name="合同详情" />} />

      {/* 审批 */}
      <Route path="/approval" element={<ApprovalHub />} />
      <Route path="/approval/purchase" element={<PurchaseApprovalList />} />
      <Route path="/approval/purchase/:id" element={<PurchaseApprovalDetail />} />

      {/* 用车 */}
      <Route path="/vehicle-use" element={<Placeholder name="用车申请" />} />

      {/* 消息 */}
      <Route path="/message" element={<Placeholder name="消息中心" />} />

      {/* ===== 唯车城（经营公司端 — 企微H5） ===== */}
      <Route path="/wcc/login" element={<WccLogin />} />
      <Route path="/wcc/home" element={<WccHome />} />
      <Route path="/wcc/purchase" element={<WccPurchaseList />} />
      <Route path="/wcc/purchase/:id" element={<WccPurchaseDetail />} />

      {/* 404 */}
      <Route path="*" element={<Placeholder name="404 页面不存在" />} />
    </Routes>
  )
}
