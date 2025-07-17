import React from "react";
import { HoverEffect } from "components/ui/card-hover-effect";

// 북마크 타입 예시 (실제 데이터 구조에 맞게 수정)
export type TopBookmark = {
  id: number;
  title: string;
  description: string;
  link: string;
};

interface TopBookmarksProps {
  bookmarks: TopBookmark[];
  theme: string;
}

export function TopBookmarks({ bookmarks, theme }: TopBookmarksProps) {
  const isDark = theme === "dark";
  return (
    <div className="w-full mx-auto mt-8 py-0">
      <div className={`rounded-2xl shadow-xl border p-8 ${isDark ? 'border-gray-700' : 'border-gray-400'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">
          자주 사용하는 북마크
        </h1>
        <HoverEffect items={bookmarks} theme={theme} />
      </div>
    </div>
  );
}
