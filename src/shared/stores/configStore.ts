import { create } from 'zustand'
import type { SupervisionPlan } from '@shared/types'

interface ConfigState {
  /** 当前经销公司的监管方案 */
  supervisionPlan: SupervisionPlan | null
  setSupervisionPlan: (plan: SupervisionPlan) => void
}

export const useConfigStore = create<ConfigState>((set) => ({
  supervisionPlan: null,
  setSupervisionPlan: (plan) => set({ supervisionPlan: plan }),
}))
