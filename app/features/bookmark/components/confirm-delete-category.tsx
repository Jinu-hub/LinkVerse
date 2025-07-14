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

import type { Category } from "../lib/bookmark.types";
import { deleteCategory } from "../lib/caActions";

interface ConfirmDeleteCategoryProps {
  open: boolean;
  category: Category | null;
  onConfirm: () => void;
  onCancel: () => void;
  setCategories: (cats: any[]) => void;
  setTabs: (tabs: any[]) => void;
  setBookmarks: (bookmarks: any[]) => void;
  dispatch: any;
  toCategory: (cat: any) => any;
  toUIViewTabs: (tab: any) => any;
}

export function ConfirmDeleteCategory({ 
  open, 
  category, 
  onConfirm, 
  onCancel,
  setCategories,
  setTabs,
  setBookmarks,
  dispatch,
  toCategory,
  toUIViewTabs,
}: ConfirmDeleteCategoryProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => {
      if (!open) onCancel();
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            "{category?.name}" 카테고리를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" 
          onClick=
          {async () => {
            await deleteCategory({
              category_id: category!.id,
              setCategories,
              setTabs,
              setBookmarks,
              dispatch,
              toCategory,
              toUIViewTabs,
            });
            onConfirm();
          }}>삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 