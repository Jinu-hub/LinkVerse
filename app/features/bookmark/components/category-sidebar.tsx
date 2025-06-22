import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { Button } from '~/core/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/core/components/ui/sheet'
import type { Category } from '../types/bookmark.types'
import { CategoryTree } from './category-tree'

interface CategorySidebarProps {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
}

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
}: CategorySidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleSelect = (id: string) => {
    onSelect(id)
    setIsSheetOpen(false) // 모바일에서 카테고리 선택 시 시트 닫기
  }

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

      {/* 🔹 모바일용 사이드바 트리거 */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <FiMenu className="mr-2 h-4 w-4" />
              카테고리
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-4 sm:w-[350px]">
            <h2 className="mb-4 mt-6 text-lg font-semibold">카테고리</h2>
            <CategoryTree
              categories={categories}
              selectedId={selectedId}
              onSelect={handleSelect}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 