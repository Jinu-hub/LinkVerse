import { useState } from 'react'
import type { Category } from '../types/bookmark.types'
import { CategoryTree } from './category-tree'

interface CategorySidebarProps {
  categories: Category[]
  selectedId: number
  onSelect: (id: number) => void
}

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
}: CategorySidebarProps) {

  return (
    <>
      {/* 🔹 1. 사이드바 영역 (데스크탑) */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <h2 className="mb-4 text-lg font-semibold">카테고리</h2>
        <CategoryTree
          categories={categories}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </aside>

    </>
  )
} 