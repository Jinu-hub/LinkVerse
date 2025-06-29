import type { mockContentTypes } from "~/features/mock-data";


export type DisplayType = "default" | "bookmarks" | "tags" | "memos";

export type ContentType = (typeof mockContentTypes)[number]["code"];

export const contentIconMap: Record<ContentType, string> = {
    bookmark: "🔖",
    book: "📘",
    movie: "🎬",
    travel: "✈️",
  };

// 콘텐츠 타입별 색상
export const typeColorMap: Record<ContentType, string> = {
    bookmark: "text-blue-700 bg-blue-100/80 dark:text-blue-200 dark:bg-blue-900/60 ring-1 ring-blue-300 dark:ring-blue-800 shadow-sm",
    book: "text-green-700 bg-green-100/80 dark:text-green-200 dark:bg-green-900/60 ring-1 ring-green-300 dark:ring-green-800 shadow-sm",
    movie: "text-red-700 bg-red-100/80 dark:text-red-200 dark:bg-red-900/60 ring-1 ring-red-300 dark:ring-red-800 shadow-sm",
    travel: "text-yellow-800 bg-yellow-100/80 dark:text-yellow-200 dark:bg-yellow-900/60 ring-1 ring-yellow-300 dark:ring-yellow-800 shadow-sm",
  };