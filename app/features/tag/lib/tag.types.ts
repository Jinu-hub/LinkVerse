import { SORT_OPTIONS, SORT_OPTIONS_CONTENTS } from "../lib/constants";

export type SortKey = typeof SORT_OPTIONS[number]["value"];

export type SortKeyContents = typeof SORT_OPTIONS_CONTENTS[number]["value"];

export type UntaggedSortKey = "title" | "url" | "createdAt";

export interface Tag { 
  id: number; 
  name: string; 
  usage_count: number; 
  createdAt: string;
  parentId?: number;
  parentName?: string;
};

export interface TagContent {
  tagId: number;
  tagName: string;
  contentTypeId: number;
  contentId: string;
  title: string;
  useCount?: number;
  description?: string;
  memo?: string;
  createdAt: string;
  url?: string;
  extra?: Record<string, string>;
}

export interface UntaggedContent {
  contentTypeId: number;
  targetId: number;
  title: string;
  url: string;
  description?: string;
  memo?: string;
  createdAt: string;
}