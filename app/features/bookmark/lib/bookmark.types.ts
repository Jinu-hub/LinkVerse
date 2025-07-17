import type { UniqueIdentifier } from "@dnd-kit/core";
import type { Props } from "@dnd-kit/core/dist/components/DragOverlay";

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  level: number;
  is_root?: boolean;
  children?: Category[];
}

export interface UI_View {
  id: number;
  name: string;
  category_id: number;
  content_type_id?: number;
  ui_view_type_id?: number;
  content?: UI_View_Content;
}

export interface UI_View_Content {
  ui_view_id: string;
  target_id: number;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  tags: string[];
  categoryId: number;
  click_count: number;
  description: string;
  created_at?: string;
  updated_at?: string;
  memo?: string;
}

export type BookmarksState = {
  selectedTabId: number;
  selectedCategoryId: number;
  searchMap: { [tabId: number]: string };
  sortKeyMap: { [tabId: number]: keyof Bookmark };
  sortOrderMap: { [tabId: number]: 'asc' | 'desc' };
  pageMap: { [tabId: number]: number };
  rowsPerPageMap: { [tabId: number]: number | 'all' };
  selectedBookmark: (Bookmark & { memo: string }) | null;
  isDetailDialogOpen: boolean;
};

export type BookmarksAction =
  | { type: 'CHANGE_TAB'; payload: { tabId: number; categoryId: number | undefined } }
  | { type: 'CHANGE_CATEGORY'; payload: { categoryId: number; tabId: number | undefined } }
  | { type: 'SORT'; payload: keyof Bookmark }
  | { type: 'SEARCH'; payload: string }
  | { type: 'CHANGE_ROWS_PER_PAGE'; payload: number | 'all' }
  | { type: 'CHANGE_PAGE'; payload: number }
  | { type: 'OPEN_DETAIL'; payload: Bookmark }
  | { type: 'CLOSE_DETAIL' };

export type FlattenedItem = Category & {
  parentId: UniqueIdentifier | null;
  depth: number;
};

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (newPage: number) => void;
}

export interface SortProps {
  sortKey: keyof Bookmark;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Bookmark) => void;
}

export interface BookmarkTableProps {
  pagedBookmarks: Bookmark[];
  sort: SortProps;
  onRowClick: (bookmark: Bookmark) => void;
  highlightText: (text: string, keyword: string) => React.ReactNode;
  search: string;
  pagination: PaginationProps;
  categoryTree: Category[];
  tags: string[];
  setCategories: (categories: Category[]) => void;
  setTabs: (tabs: UI_View[]) => void;
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  dispatch: any;
  selectedCategoryId: number;
};

export type BookmarkDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void; 
  bookmark: {
    id: number;
    title: string;
    url: string;
    tags: string[];
    memo: string;
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName?: string;
    newCategoryLevel?: number;
  };
  onSave: (updated: BookmarkDetailDialogProps["bookmark"]) => void;
  categories: Category[];
  allTags: string[];
  fieldErrors: Record<string, string[]>;
  setFieldErrors: (fieldErrors: Record<string, string[]>) => void;
  saving: boolean;
};