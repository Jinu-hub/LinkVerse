import { Input } from "~/core/components/ui/input";
import { FiMenu } from 'react-icons/fi'
import { Select, SelectContent, SelectItem
    , SelectTrigger, SelectValue } from "~/core/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/core/components/ui/tabs";
import { FiInbox } from "react-icons/fi";
import type { Category, UI_View } from "../types/bookmark.types";
import { Sheet, SheetContent, SheetTrigger } from "~/core/components/ui/sheet";
import { CategoryTree } from "./category-tree";
import { Button } from "~/core/components/ui/button";
import { useState } from "react";

type Props = {
  tabs: UI_View[];
  selectedTabId: number;
  onTabChange: (tabId: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  rowsPerPage: number | 'all';
  onRowsPerPageChange: (value: string) => void;
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
};

export function BookmarkToolbar({
  tabs,
  selectedTabId,
  onTabChange,
  searchValue,
  onSearchChange,
  rowsPerPage,
  onRowsPerPageChange,
  categories,
  selectedId,
  onSelect,
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleSelect = (id: number) => {
    onSelect(id)
    setIsSheetOpen(false) // 모바일에서 카테고리 선택 시 시트 닫기
  }

  return (
    <div className="space-y-4">

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

      <div>
        <Tabs value={selectedTabId.toString()} className="w-full">
          <TabsList
            className="
              grid gap-2
              grid-cols-4 sm:grid-cols-6 md:grid-cols-8
              min-h-[40px] h-auto
              mb-8 sm:mb-8 md:mb-4
              rounded-xl w-full p-2
              border shadow-sm
              border-zinc-200
              dark:border-zinc-700
              bg-zinc-50
              dark:bg-zinc-900
            "
          >
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id.toString()}
                onClick={() => onTabChange(tab.id)}
                className="
                  rounded-lg
                  border
                  border-transparent
                  hover:border-primary
                  hover:bg-primary/10
                  transition
                  font-semibold
                  px-3 py-2
                "
              >
                {tab.id === 0 && <FiInbox className="mr-2 h-4 w-4" />}
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            placeholder="북마크 검색"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">표시 개수:</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={onRowsPerPageChange}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 