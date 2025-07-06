import { Collapsible, CollapsibleContent } from "~/core/components/ui/collapsible";
import { Button } from "~/core/components/ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import { TbGripVertical } from "react-icons/tb";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/core/components/ui/dropdown-menu";
import { ALL_CATEGORY_ID } from "../lib/constants";
import { useIsMobile } from "~/core/hooks/use-mobile";
import { CategoryInput } from "./category-input";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryButton } from "./category-button";

export type Category = {
  id: number;
  name: string;
  children?: Category[];
};

type Props = {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
  isMobile?: boolean;
};

export function CategoryTree({ categories, selectedId, onSelect, isMobile: isMobileProp }: Props) {
  const isMobile = isMobileProp ?? useIsMobile();
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [addingToId, setAddingToId] = useState<number | null>(null); // 'parent' or 'root'
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);

  const handleRename = (id: number) => {
    setRenamingId(id);
    setAddingToId(null);
  };

  const handleAdd = (parentId: number | null) => {
    setAddingToId(parentId ?? 0);
    setRenamingId(null);
  };
  
  const handleCancel = () => {
    setRenamingId(null);
    setAddingToId(null);
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          selectedId={selectedId}
          onSelect={onSelect}
          isMobile={isMobile}
          // State props
          renamingId={renamingId}
          addingToId={addingToId}
          // Action props
          onRename={handleRename}
          onAdd={handleAdd}
          onDelete={setDeleteCandidate}
          onCancel={handleCancel}
        />
      ))}
      {/* "새 카테고리" 버튼 */}
      <Button variant="ghost"
        className="w-full justify-start text-sm mt-4" 
        onClick={() => handleAdd(null)}
      >
        + 새 카테고리
      </Button>
      
      {/* 하위 카테고리 추가 입력창 */}
      {addingToId === 0 && (
        <div className="pl-4">
          <CategoryInput
            autoFocus
            onSubmit={handleCancel}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <CategoryDeleteDialog
        open={!!deleteCandidate}
        category={deleteCandidate}
        onConfirm={() => setDeleteCandidate(null)}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}

function CategoryNode({
  category,
  selectedId,
  onSelect,
  isMobile: isMobileProp,
  renamingId,
  addingToId,
  onRename,
  onAdd,
  onDelete,
  onCancel,
}: {
  category: Category;
  selectedId: number;
  onSelect: (id: number) => void;
  isMobile?: boolean;
  renamingId: number | null;
  addingToId: number | null;
  onRename: (id: number) => void;
  onAdd: (parentId: number | null) => void;
  onDelete: (category: Category) => void;
  onCancel: () => void;
}) {
  const isMobile = isMobileProp ?? useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // 하위 카테고리 추가 시 자동으로 펼쳐지도록 처리
  useEffect(() => {
    if (addingToId === category.id) {
      setIsOpen(true);
    }
  }, [addingToId, category.id]);

  // 이름 변경 중일 때
  if (renamingId === category.id) {
    return (
      <div className="pl-4">
        <CategoryInput
          defaultValue={category.name}
          autoFocus
          onSubmit={onCancel}
          onCancel={onCancel}
        />
      </div>
    );
  }
  
  // 일반 상태
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center group rounded-md hover:bg-accent">
        {/* 드래그 핸들 (전체보기 제외) */}
        {category.id > ALL_CATEGORY_ID ? (
          <TbGripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
        ) : (
          <div className="w-5" /> // 정렬을 위한 스페이서
        )}
        
        {isMobile || true ? (
          <CategoryButton
            selected={selectedId === category.id}
            onClick={() => onSelect(category.id)}
            isMobile={!!isMobile}
            hasChildren={!!hasChildren}
            isOpen={!!isOpen}
          >
            {category.name}
          </CategoryButton>
        ) : null}
        
        {/* 점 세개(케밥) 메뉴 (전체보기 제외) */}
        {category.id > ALL_CATEGORY_ID && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <FiMoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onAdd(category.id)}>하위 카테고리 추가</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(category.id)}>이름 변경</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => {
                  setTimeout(() => {
                    onDelete(category);
                  }, 100);
                }}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CollapsibleContent className="pl-6 border-l-2 border-dashed border-gray-200 dark:border-zinc-700 ml-5">
        <div className="space-y-1 mt-1">
          {category.children?.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
              isMobile={isMobile}
              renamingId={renamingId}
              addingToId={addingToId}
              onRename={onRename}
              onAdd={onAdd}
              onDelete={onDelete}
              onCancel={onCancel}
            />
          ))}
          {/* 하위 카테고리 추가 입력창 */}
          { addingToId !== ALL_CATEGORY_ID && addingToId === category.id && (
            <div className="pl-4">
              <CategoryInput
                autoFocus
                onSubmit={onCancel}
                onCancel={onCancel}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
