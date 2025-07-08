import type { Bookmark } from "../types/bookmark.types";

export const ALL_TAB_ID = 9999;
export const UNCATEGORIZED_TAB_ID = -1;
export const ALL_CATEGORY_ID = 0;
export const UNCATEGORIZED_CATEGORY_ID = -1;
export const DEFAULT_SORT_KEY = 'title';
export const DEFAULT_ROWS_PER_PAGE = 5; 

export const SORTABLE_COLUMNS: { key: keyof Bookmark; label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'url', label: 'URL' },
    { key: 'tags', label: '태그' },
    { key: 'click_count', label: '클릭수' },
  ];


export const TAGS_CHUNK_SIZE = 3;
export const BADGE_ODD_EVEN_MOD = 2;
export const HOT_CLICK_COUNT_THRESHOLD = 7;
export const EDIT_DIALOG_TIMEOUT = 100; // ms