import React from "react";
import { HoverEffect } from "components/ui/card-hover-effect";
import type { HomeBookmark } from "../lib/home.types";
import { Button } from "~/core/components/ui/button";
import { Link } from "react-router";

interface TopBookmarksProps {
  bookmarks: HomeBookmark[];
  theme: string;
}

export function TopBookmarks({ bookmarks, theme }: TopBookmarksProps) {
  const isDark = theme === "dark";
  return (
    <div className="w-full mx-auto mt-8 py-0">
      <div className={`rounded-2xl shadow-xl border p-8 ${isDark ? 'border-gray-700' : 'border-gray-400'}`}>
        {bookmarks.length > 0 && (
          <>
            <span className="uppercase text-xs tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-1 block">TOP BOOKMARKS</span>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mb-4 drop-shadow">
              자주 사용하는 북마크
            </h1>
            <HoverEffect items={bookmarks} theme={theme} />
          </>
        )}
        {bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl mt-4">
            <svg className="h-12 w-12 mb-4 text-blue-400 animate-pulse drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center mb-2 drop-shadow">아직 자주 사용하는 북마크가 없어요!</h2>
            <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-4 font-medium">
              자주 찾는 북마크가 이곳에 멋지게 모여요.<br />지금 바로 나만의 즐겨찾기를 만들어보세요!
            </p>
            <Button variant="outline" size="lg" asChild className="shadow-xl transition-transform hover:scale-110 flex items-center gap-2 border-blue-400 text-blue-700 dark:text-blue-300 dark:border-blue-500 font-bold">
              <Link to="/bookmarks">
                <svg className="w-5 h-5 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                북마크 관리하러 가기
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
