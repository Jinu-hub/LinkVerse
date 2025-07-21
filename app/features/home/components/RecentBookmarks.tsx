import React from "react";
import { HoverEffect } from "components/ui/card-hover-effect";
import type { HomeBookmark } from "../lib/home.types";
import { Link } from "react-router";
import { Button } from "~/core/components/ui/button";

interface RecentBookmarksProps {
  bookmarks: HomeBookmark[];
  theme: string;
}

export function RecentBookmarks({ bookmarks, theme }: RecentBookmarksProps) {
  const isDark = theme === "dark";
  return (
    <div className="w-full mx-auto mt-8 py-0">
      <div className={`rounded-2xl shadow-xl border p-8 ${isDark ? 'border-gray-700' : 'border-gray-400'}`}>
        {bookmarks.length > 0 && (
          <>
            <span className="uppercase text-xs tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-1 block">RECENT BOOKMARKS</span>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mb-4 drop-shadow">
              최근에 추가된 북마크
            </h1>
            <HoverEffect items={bookmarks} theme={theme} displayType="recent" />
          </>
        )}
        {bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl mt-4">
            <svg className="h-12 w-12 mb-4 text-blue-400 animate-pulse drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75zm0 18.5A8.25 8.25 0 1 1 20.25 12 8.26 8.26 0 0 1 12 20.25zm.75-13.5h-1.5v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center mb-2 drop-shadow">최근에 추가된 북마크가 없어요!</h2>
            <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-4 font-medium">
              최근에 추가한 북마크가 이곳에 멋지게 모여요.<br />지금 바로 새로운 북마크를 추가해보세요!
            </p>
            <Button variant="outline" size="lg" asChild className="shadow-xl transition-transform hover:scale-110 flex items-center gap-2 border-blue-400 text-blue-700 dark:text-blue-300 dark:border-blue-500 font-bold">
              <Link to="/bookmarks">
                <svg className="w-5 h-5 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75zm0 18.5A8.25 8.25 0 1 1 20.25 12 8.26 8.26 0 0 1 12 20.25zm.75-13.5h-1.5v6l5.25 3.15.75-1.23-4.5-2.67z" />
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
