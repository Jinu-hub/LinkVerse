import React from "react";
import { HoverEffect } from "components/ui/card-hover-effect";
import type { HomeBookmark } from "../lib/home.types";

interface RecentBookmarksProps {
  bookmarks: HomeBookmark[];
  theme: string;
}

export function RecentBookmarks({ bookmarks, theme }: RecentBookmarksProps) {
  const isDark = theme === "dark";
  // HoverEffect는 title, description, link 필드를 가진 배열을 받음
  return (
    <div className="w-full mx-auto mt-8 py-0">
      <div className={`rounded-2xl shadow-xl border p-8 ${isDark ? 'border-gray-700' : 'border-gray-400'}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">
          최근에 추가된 북마크
        </h1>
        <HoverEffect items={bookmarks} theme={theme} displayType="recent" />
      </div>
    </div>
  );
}
