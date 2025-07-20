import { Input } from "~/core/components/ui/input";
import { FiMenu, FiInbox, FiAlertCircle } from 'react-icons/fi'
import { Select, SelectContent, SelectItem
    , SelectTrigger, SelectValue } from "~/core/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/core/components/ui/tabs";
import type { Bookmark, Category, UI_View } from "../lib/bookmark.types";
import { Sheet, SheetContent, SheetTrigger } from "~/core/components/ui/sheet";
import { CategoryTree } from "./category-tree";
import { Button } from "~/core/components/ui/button";
import { useState } from "react";
import { ALL_TAB_ID } from "../lib/constants";

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
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTabs: React.Dispatch<React.SetStateAction<UI_View[]>>;
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
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
  setCategories,
  setTabs,
  setBookmarks,
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleSelect = (id: number) => {
    onSelect(id)
    setIsSheetOpen(false) // 모바일에서 카테고리 선택 시 시트 닫기
  }

  // 탭 분리
  const mainTabs = tabs.filter(tab => tab.id === 9999 || tab.id === -1);
  const otherTabs = tabs.filter(tab => tab.id !== 9999 && tab.id !== -1);

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
              setCategories={setCategories}
              setTabs={setTabs}
              setBookmarks={setBookmarks}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* 상단: 전체, 미분류 탭 */}
      <div className="flex gap-2 mb-2">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            className={`
              px-2 py-2 rounded-full border transition flex items-center justify-center gap-1
              ${tab.id === ALL_TAB_ID ? 'w-24' : ''}
              ${tab.id === -1 ? 'w-24' : ''}
              ${selectedTabId == tab.id
                ? 'bg-primary text-white border-primary-600 shadow dark:bg-gray-900 dark:text-white dark:border-2 dark:border-white'
                : 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'}
              hover:border-primary hover:bg-primary/10 dark:hover:bg-white/30
              hover:text-primary
              font-semibold
            `}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.id === ALL_TAB_ID && <FiInbox className="h-4 w-4" />}
            {tab.id === -1 && <FiAlertCircle className="h-4 w-4" />}
            <span className="whitespace-nowrap">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 아래: 나머지 탭들은 grid로 줄바꿈 */}
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
          {otherTabs.map(tab => (
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
                data-[state=active]:bg-zinc-800
                data-[state=active]:text-white
                data-[state=active]:border-zinc-800
                dark:data-[state=active]:bg-gray-900
                dark:data-[state=active]:text-white
                dark:data-[state=active]:border-white
              "
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="북마크 검색"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">표시 개수</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={onRowsPerPageChange}
          >
            <SelectTrigger className="w-20 h-8 sm:p-1">
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