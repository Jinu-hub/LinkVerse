import { z } from "zod";
import type { Bookmark } from "../types/bookmark.types";

export const ALL_TAB_ID = 9999;
export const UNCATEGORIZED_TAB_ID = -1;
export const ALL_CATEGORY_ID = 0;
export const UNCATEGORIZED_CATEGORY_ID = -1;
export const DEFAULT_SORT_KEY = 'title';
export const DEFAULT_ROWS_PER_PAGE = 5; 

export const TAGS_CHUNK_SIZE = 3;
export const BADGE_ODD_EVEN_MOD = 2;
export const HOT_CLICK_COUNT_THRESHOLD = 7;
export const EDIT_DIALOG_TIMEOUT = 100; // ms
export const EMPTY_BOOKMARK = {
    id: 0,
    title: '',
    url: '',
    tags: [],
    memo: '',
    categoryId: undefined,
  };

export const SORTABLE_COLUMNS: { key: keyof Bookmark; label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'url', label: 'URL' },
    { key: 'tags', label: '태그' },
    { key: 'click_count', label: '클릭수' },
  ];

export const bookmarkSchema = z.object({
    url: z.string().url({ message: "Invalid URL" }),
    title: z.string().max(255).optional().default(""),
    tags: z.array(z.string().max(20)).optional().default([]),
    categoryId: z.number().nullable().optional(),
    parentCategoryId: z.number().nullable().optional(),
    newCategoryName: z.string().max(30).nullable().optional(),
    newCategoryLevel: z.number().nullable().optional(),
    memo: z.string().nullable().optional(),
});