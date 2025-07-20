import type { Memo } from "./memo.types";


import type { SortKey } from "./memo.types";

export const SORTABLE_COLUMNS:
 { key: SortKey; label: string; width: string; isSortable: boolean; isMobileHidden: boolean }[] = [
    { key: 'contentTypeId', label: '유형', width: '10%', isSortable: true, isMobileHidden: false },
    { key: 'title', label: '제목', width: '30%', isSortable: true, isMobileHidden: false },
    { key: 'content', label: '내용', width: '40%', isSortable: true, isMobileHidden: false },
    { key: 'createdAt', label: '생성일', width: '10%', isSortable: true, isMobileHidden: false },
    { key: 'updatedAt', label: '수정일', width: '10%', isSortable: true, isMobileHidden: true },
  ];