import { SORT_OPTIONS, SORT_OPTIONS_CONTENTS } from "../lib/constants";

// Tag 타입 정의 추가
export type Tag = { id: number; name: string; usage_count: number; createdAt: string };

export type SortKey = typeof SORT_OPTIONS[number]["value"];

export type SortKeyContents = typeof SORT_OPTIONS_CONTENTS[number]["value"];

export interface TagContent {
    contentId: string;
    tagId: number;
    contentTypeId: number;
    title: string;
    description?: string;
    url?: string;
    createdAt: string;
    extra?: Record<string, string>;
    memo?: string;
  }

  export interface ContentItem {
    tagId: number
    title: string
    memo?: string
    createdAt: string
    clickCount?: number
    url?: string
    extra?: Record<string, string>
  }
  