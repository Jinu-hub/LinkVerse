import { useState } from 'react'
import type { Bookmark, Category, UI_View } from '../lib/bookmark.types'
import { CategoryTree } from './category-tree'

interface CategorySidebarProps {
  categories: Category[]
  selectedId: number
  onSelect: (id: number) => void
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTabs: React.Dispatch<React.SetStateAction<UI_View[]>>;
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
  setCategories,
  setTabs,
  setBookmarks,
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
          setCategories={setCategories}
          setTabs={setTabs}
          setBookmarks={setBookmarks}
        />
      </aside>

    </>
  )
} 