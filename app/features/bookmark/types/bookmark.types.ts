export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  categoryId: string;
  click_count: number;
  created_at?: string;
  updated_at?: string;
  memo?: string;
}

export interface Category {
  id: string;
  parent_id: string;
  name: string;
  level: number;
  is_root?: boolean;
  children?: Category[];
}

export interface UI_View {
  id: string;
  name: string;
  category_id: string;
  content_type_id?: string;
  ui_view_type_id?: string;
  content?: UI_View_Content;
}

export interface UI_View_Content {
  ui_view_id: string;
  target_id: number;
}

export type BookmarksState = {
  selectedTabId: string;
  selectedCategoryId: string;
  searchMap: { [tabId: string]: string };
  sortKeyMap: { [tabId: string]: keyof Bookmark };
  sortOrderMap: { [tabId: string]: 'asc' | 'desc' };
  pageMap: { [tabId: string]: number };
  rowsPerPageMap: { [tabId:string]: number | 'all' };
  selectedBookmark: (Bookmark & { memo: string }) | null;
  isDetailDialogOpen: boolean;
};

export type BookmarksAction =
  | { type: 'CHANGE_TAB'; payload: { tabId: string; categoryId: string | undefined } }
  | { type: 'CHANGE_CATEGORY'; payload: { categoryId: string; tabId: string | undefined } }
  | { type: 'SORT'; payload: keyof Bookmark }
  | { type: 'SEARCH'; payload: string }
  | { type: 'CHANGE_ROWS_PER_PAGE'; payload: number | 'all' }
  | { type: 'CHANGE_PAGE'; payload: number }
  | { type: 'OPEN_DETAIL'; payload: Bookmark }
  | { type: 'CLOSE_DETAIL' };