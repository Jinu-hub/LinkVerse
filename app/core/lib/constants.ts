import type { ContentType, UiType } from "./types";

export const CONTENT_TYPES: ContentType[] = [
    { id: 0, code: "all" },
    { id: 1, code: "bookmark" },
    { id: 2, code: "book" },
    { id: 3, code: "movie" },
    { id: 4, code: "travel" },
] as const;

export const UI_TYPES: UiType[] = [
    { id: 0, code: "default" },
    { id: 1, code: "list" },
    { id: 2, code: "card" },
    { id: 3, code: "grid" },
    { id: 4, code: "timeline" },
    { id: 5, code: "table" },
    { id: 6, code: "calendar" },
    { id: 7, code: "map" },
    { id: 8, code: "chart" },
    { id: 9, code: "gallery" },
    { id: 10, code: "tab" },
] as const;

export const ACTIVITY_TYPES = [
    {id: 0, code: "click"},
    {id: 1, code: "view"},
    {id: 2, code: "edit"},
    {id: 3, code: "delete"},
    {id: 4, code: "create"},    
    {id: 5, code: "share"},
    {id: 6, code: "export"},
    {id: 7, code: "import"}, 
] as const;
  

export const contentIconMap: Record<ContentType["code"], string> = {
    bookmark: "🔖",
    book: "📘",
    movie: "🎬",
    travel: "✈️",
  };

// 콘텐츠 타입별 색상
export const typeColorMap: Record<ContentType["code"], string> = {
    bookmark: "text-blue-700 bg-blue-100/80 dark:text-blue-200 dark:bg-blue-900/60 ring-1 ring-blue-300 dark:ring-blue-800 shadow-sm",
    book: "text-green-700 bg-green-100/80 dark:text-green-200 dark:bg-green-900/60 ring-1 ring-green-300 dark:ring-green-800 shadow-sm",
    movie: "text-red-700 bg-red-100/80 dark:text-red-200 dark:bg-red-900/60 ring-1 ring-red-300 dark:ring-red-800 shadow-sm",
    travel: "text-yellow-800 bg-yellow-100/80 dark:text-yellow-200 dark:bg-yellow-900/60 ring-1 ring-yellow-300 dark:ring-yellow-800 shadow-sm",
  };