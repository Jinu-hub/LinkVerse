export interface Memo {
    memoId: number;
    contentTypeId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }

export type SortKey = 'contentTypeId' | 'title' | 'content' | 'createdAt' | 'updatedAt';