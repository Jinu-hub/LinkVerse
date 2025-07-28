import { z } from "zod";
import type { Bookmark } from "./bookmark.types";
import { createTagValidation } from "~/features/tag/lib/constants";

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

export const SORTABLE_COLUMNS:
 { key: keyof Bookmark; label: string; width: string; isSortable: boolean; isMobileHidden: boolean }[] = [
    { key: 'title', label: '제목', width: '30%', isSortable: true, isMobileHidden: false },
    { key: 'url', label: 'URL', width: '35%', isSortable: true, isMobileHidden: true },
    { key: 'tags', label: '태그', width: '35%', isSortable: true, isMobileHidden: false },
    { key: 'click_count', label: '클릭수', width: '10%', isSortable: true, isMobileHidden: false },
  ];

// 카테고리 검증 스키마 생성 함수
export const createCategoryValidation = () => 
  z.string()
    .refine(
      (category) => category.length === 0 || category.length <= 30,
      "카테고리명은 최대 30자까지 가능합니다"
    )
    /*
    .refine(
      (category) => category.length === 0 || /^[a-zA-Z0-9가-힣]+$/.test(category),
      "카테고리명은 영문, 숫자, 한글만 사용 가능합니다"
    )
    .refine(
      (category) => category.length === 0 || !/[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?\s]/.test(category),
      "특수문자와 공백은 사용할 수 없습니다"
    )
    */
;

export const bookmarkSchema = z.object({
    url: z.string()
      .min(1, "URL을 입력해주세요")
      .refine(
        (url) => url.length === 0 || /^https?:\/\/.+/.test(url),
        { message: "올바른 URL 형식이 아닙니다" }
      ),
    title: z.string().max(255).optional().default(""),
    tags: z.array(createTagValidation()).optional().default([]),
    categoryId: z.number().nullable().optional(),
    parentCategoryId: z.number().nullable().optional(),
    newCategoryName: createCategoryValidation().nullable().optional(),
    newCategoryLevel: z.number().max(3, "카테고리 레벨은 최대 3까지 가능합니다").nullable().optional() ,
    memo: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
}).refine(
  (data) => {
    // parentCategoryId = 0, newCategoryName 입력됨, newCategoryLevel > 1인 경우 체크
    if (data.parentCategoryId === 0 && 
        data.newCategoryName && 
        data.newCategoryName.length > 0 && 
        data.newCategoryLevel && 
        data.newCategoryLevel > 1) {
      return false;
    }
    return true;
  },
  { message: "한번에 2레벨 이상의 새로운 카테고리 생성은 불가능합니다" }
);