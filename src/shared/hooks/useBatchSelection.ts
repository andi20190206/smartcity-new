import { useState, useCallback } from 'react'

/**
 * 通用批量选择Hook
 * 用于：批量审批、批量选车销售等
 */
export function useBatchSelection<T extends { id: string }>() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((items: T[]) => {
    setSelectedIds(new Set(items.map((item) => item.id)))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  )

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    selectedArray: Array.from(selectedIds),
  }
}
