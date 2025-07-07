import { Collapsible, CollapsibleContent } from "~/core/components/ui/collapsible";
import { Button } from "~/core/components/ui/button";
import { TbGripVertical } from "react-icons/tb";
import { useState, useEffect } from "react";
import { ALL_CATEGORY_ID } from "../lib/constants";
import { useIsMobile } from "~/core/hooks/use-mobile";
import { CategoryInput } from "./category-input";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryButton } from "./category-button";
import { CategoryTreeProvider, useCategoryTreeContext } from "./category-tree-context";
import { CategoryActionsMenu } from "./category-actions-menu";
import type { Category, UI_View } from "../types/bookmark.types";
import { toCategory, toUIViewTabs } from "../lib/bmUtils";
import { addCategory } from "../lib/caActions";

export function CategoryTree({
  categories,
  selectedId,
  onSelect,
  isMobile: isMobileProp,
  setCategories,
  setTabs,
}: {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
  isMobile?: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTabs: React.Dispatch<React.SetStateAction<UI_View[]>>;
}) {
  const isMobile = isMobileProp ?? useIsMobile();
  return (
    <CategoryTreeProvider>
      <CategoryTreeInner
        categories={categories}
        selectedId={selectedId}
        onSelect={onSelect}
        isMobile={isMobile}
        setCategories={setCategories}
        setTabs={setTabs}
      />
    </CategoryTreeProvider>
  );
}

function CategoryTreeInner({
  categories,
  selectedId,
  onSelect,
  isMobile,
  setCategories,
  setTabs,
}: {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
  isMobile: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTabs: React.Dispatch<React.SetStateAction<UI_View[]>>;
}) {
  const { state, dispatch } = useCategoryTreeContext();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          selectedId={selectedId}
          onSelect={onSelect}
          isMobile={isMobile}
          setCategories={setCategories}
          setTabs={setTabs}
          setError={setError}
          setSubmitting={setSubmitting}
          error={error}
          submitting={submitting}
        />
      ))}
      {/* "새 카테고리" 버튼 */}
      <Button variant="ghost"
        className="w-full justify-start text-sm mt-4" 
        onClick={() => dispatch({ type: "ADD", parentId: null })}
      >
        + 새 카테고리
      </Button>
      {/* 루트 카테고리 추가 입력창 */}
      {state.addingToId === 0 && (
        <div className="pl-4">
          <CategoryInput
            autoFocus
            onSubmit={async (name) => {
              await addCategory({
                name,
                setCategories,
                setTabs,
                setError,
                dispatch,
                toCategory,
                toUIViewTabs,
                setSubmitting,
              });
            }}
            onCancel={() => {
              setError("");
              setSubmitting(false);
              dispatch({ type: "CANCEL" });
            }}
            error={error}
            setError={setError}
            disabled={submitting}
          />
        </div>
      )}
      {/* 삭제 확인 다이얼로그 */}
      <CategoryDeleteDialog
        open={!!state.deleteCandidate}
        category={state.deleteCandidate}
        onConfirm={() => dispatch({ type: "DELETE_CANDIDATE_CLEAR" })}
        onCancel={() => dispatch({ type: "DELETE_CANDIDATE_CLEAR" })}
      />
    </div>
  );
}

function CategoryNode({
  category,
  selectedId,
  onSelect,
  isMobile: isMobileProp,
  setCategories,
  setTabs,
  setError,
  setSubmitting,
  error,
  submitting,
}: {
  category: Category;
  selectedId: number;
  onSelect: (id: number) => void;
  isMobile?: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTabs: React.Dispatch<React.SetStateAction<UI_View[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  submitting: boolean;
}) {
  const isMobile = isMobileProp ?? useIsMobile();
  const { state, dispatch } = useCategoryTreeContext();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  useEffect(() => {
    if (state.addingToId === category.id) {
      setIsOpen(true);
    }
  }, [state.addingToId, category.id]);

  // 이름 변경 중일 때
  if (state.renamingId === category.id) {
    return (
      <div className="pl-4">
        <CategoryInput
          defaultValue={category.name}
          autoFocus
          onSubmit={() => dispatch({ type: "CANCEL" })}
          onCancel={() => dispatch({ type: "CANCEL" })}
        />
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center group rounded-md hover:bg-accent">
        {/* 드래그 핸들 (전체보기 제외) */}
        {category.id > ALL_CATEGORY_ID ? (
          <TbGripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
        ) : (
          <div className="w-5" />
        )}
        <CategoryButton
          selected={selectedId === category.id}
          onClick={() => onSelect(category.id)}
          isMobile={!!isMobile}
          hasChildren={!!hasChildren}
          isOpen={!!isOpen}
        >
          {category.name}
        </CategoryButton>
        {/* 점 세개(케밥) 메뉴 (전체보기 제외) */}
        {category.id > ALL_CATEGORY_ID && (
          <CategoryActionsMenu category={category} />
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
              setCategories={setCategories}
              setTabs={setTabs}
              setError={setError}
              setSubmitting={setSubmitting}
              error={error}
              submitting={submitting}
            />
          ))}
          {/* 하위 카테고리 추가 입력창 */}
          { state.addingToId !== ALL_CATEGORY_ID && state.addingToId === category.id && (
            <div className="pl-4">
              <CategoryInput
                autoFocus
                onSubmit={async (name) => {
                  await addCategory({
                    name,
                    setCategories,
                    setTabs,
                    setError,
                    dispatch,
                    toCategory,
                    toUIViewTabs,
                    setSubmitting,
                    parent_id: category.id,
                    level: category.level + 1,
                  });
                }}
                onCancel={() => {
                  setError("");
                  setSubmitting(false);
                  dispatch({ type: "CANCEL" });
                }}
                error={error}
                setError={setError}
                disabled={submitting}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
