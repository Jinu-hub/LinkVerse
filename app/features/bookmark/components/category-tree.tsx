import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/core/components/ui/collapsible";
import { Button } from "~/core/components/ui/button";
import { FiChevronRight, FiMoreHorizontal } from "react-icons/fi";
import { TbGripVertical } from "react-icons/tb";
import { cn } from "~/core/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/core/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/core/components/ui/alert-dialog";
import { Input } from "~/core/components/ui/input";

type Category = {
  id: string;
  name: string;
  children?: Category[];
};

type Props = {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  isMobile?: boolean;
};

export function CategoryTree({ categories, selectedId, onSelect, isMobile }: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [addingToId, setAddingToId] = useState<string | null>(null); // 'parent' or 'root'
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);

  const handleRename = (id: string) => {
    setRenamingId(id);
    setAddingToId(null);
  };

  const handleAdd = (parentId: string | null) => {
    setAddingToId(parentId ?? 'root');
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
      <Button variant="ghost" className="w-full justify-start text-sm mt-4" onClick={() => handleAdd(null)}>
        + 새 카테고리
      </Button>
      
      {/* 하위 카테고리 추가 입력창 */}
      {addingToId === 'root' && (
        <div className="pl-4">
          <Input 
            autoFocus
            placeholder="새 카테고리 이름" 
            onKeyDown={(e) => e.key === 'Enter' && handleCancel()}
            onBlur={handleCancel}
          />
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => {
        if (!open) {
          setDeleteCandidate(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteCandidate?.name}" 카테고리를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => setDeleteCandidate(null)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CategoryNode({
  category,
  selectedId,
  onSelect,
  isMobile,
  renamingId,
  addingToId,
  onRename,
  onAdd,
  onDelete,
  onCancel,
}: {
  category: Category;
  selectedId: string;
  onSelect: (id: string) => void;
  isMobile?: boolean;
  renamingId: string | null;
  addingToId: string | null;
  onRename: (id: string) => void;
  onAdd: (parentId: string | null) => void;
  onDelete: (category: Category) => void;
  onCancel: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // 이름 변경 중일 때
  if (renamingId === category.id) {
    return (
      <div className="pl-4">
        <Input 
          defaultValue={category.name}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && onCancel()}
          onBlur={onCancel}
        />
      </div>
    );
  }
  
  // 일반 상태
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center group rounded-md hover:bg-accent">
        {/* 드래그 핸들 (전체보기 제외) */}
        {category.id !== '0' ? (
          <TbGripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
        ) : (
          <div className="w-5" /> // 정렬을 위한 스페이서
        )}
        
        {isMobile ? (
          <>
            {/* Mobile: Separated buttons */}
            <Button
              variant="ghost"
              className={cn("flex-1 justify-start h-8 truncate", selectedId === category.id && "bg-accent text-accent-foreground")}
              onClick={() => onSelect(category.id)}
            >
              {category.name}
            </Button>
            {hasChildren && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiChevronRight className={cn("transition-transform", isOpen && "rotate-90")} />
                </Button>
              </CollapsibleTrigger>
            )}
          </>
        ) : (
          // Desktop: Combined button
          <CollapsibleTrigger asChild className="flex-1">
            <Button
              variant="ghost"
              className={cn("w-full justify-start h-8", selectedId === category.id && "bg-accent text-accent-foreground")}
              onClick={() => onSelect(category.id)}
            >
              {hasChildren && <FiChevronRight className={cn("transition-transform mr-2", isOpen && "rotate-90")} />}
              <span className="truncate flex-1 text-left">{category.name}</span>
            </Button>
          </CollapsibleTrigger>
        )}
        
        {/* 점 세개(케밥) 메뉴 (전체보기 제외) */}
        {category.id !== '0' && (
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
          {addingToId === category.id && (
            <div className="pl-4">
              <Input 
                autoFocus
                placeholder="새 하위 카테고리" 
                onKeyDown={(e) => e.key === 'Enter' && onCancel()}
                onBlur={onCancel}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
