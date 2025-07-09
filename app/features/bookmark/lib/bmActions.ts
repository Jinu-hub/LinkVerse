import type { Bookmark, Category } from "../types/bookmark.types";
import { toBookmarks, toCategory, toUIViewTabs } from "./bmUtils";
import { bookmarkSchema } from "./constants";
import { data } from "react-router";


export async function addBookmark({
    title,
    url,
    tags,
    categoryId,
    parentCategoryId,
    newCategoryName,
    memo,
    setCategories,
    setTabs,
    setBookmarks,
}: {
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    memo: string;
    setCategories: (categories: Category[]) => void;
    setTabs: (tabs: any[]) => void;
    setBookmarks: (bookmarks: Bookmark[]) => void;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        tags,
        newCategoryName,
        memo,
    });
    if (!success) {
        return { ok: false, fieldErrors: error.flatten().fieldErrors };
    }

    try {
        // 1. 북마크 추가
        const res = await fetch("/bookmarks/api/bookmark/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validData),
        });
        if (!res.ok) {
            return { ok: false, error: "북마크 추가에 실패했습니다." };
        }
        const { data: newBookmark } = await res.json();

        // 2. 전체 카테고리/탭 목록 재요청 (새로운 루트 카테고리 추가 시)
        if (newCategoryName && parentCategoryId === 0) {
            const res_get = await fetch("/bookmarks/api/category");
            if (!res_get.ok) {
                return { ok: false, error: "카테고리 목록을 불러오지 못했습니다." };
            }
            const { categories: newCategories, tabs: newTabs } = await res_get.json();
            setCategories(newCategories.map(toCategory));
            setTabs(newTabs.map(toUIViewTabs));
        }

        // 3. 추가된 북마크 목록 재요청
        const res_get = await fetch("/bookmarks/api/bookmark");
        if (!res_get.ok) {
            return { ok: false, error: "북마크 목록을 불러오지 못했습니다." };
        }
        const { bookmarks: newBookmarks } = await res_get.json();
        setBookmarks(newBookmarks.map(toBookmarks));
  
        return { ok: true, data: newBookmark }; 
    } catch (e) {
        console.log(e);
        return { ok: false, error: "알 수 없는 에러가 발생했습니다." };
    }
   
}

export async function editBookmark({
    id,
    title,
    url,
    tags,
    categoryId,
    parentCategoryId,
    newCategoryName,
    memo,
    setCategories,
    setTabs,
    setBookmarks,
}: {
    id: number;
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    memo: string;
    setCategories: (categories: Category[]) => void;
    setTabs: (tabs: any[]) => void;
    setBookmarks: (bookmarks: Bookmark[]) => void;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        tags,
        newCategoryName,
        memo,
    });
    if (!success) {
        return { ok: false, fieldErrors: error.flatten().fieldErrors };
    }

    try {
        // 1. 북마크 수정
        const res = await fetch(`/bookmarks/api/bookmark/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validData),
        });
        if (!res.ok) {
            return { ok: false, error: "북마크 수정에 실패했습니다." };
        }
        const { data: updatedBookmark } = await res.json();

        // 2. 전체 카테고리/탭 목록 재요청 (새로운 루트 카테고리 추가 시)
        if (newCategoryName && parentCategoryId === 0) {
            const res_get = await fetch("/bookmarks/api/category");
            if (!res_get.ok) {
                return { ok: false, error: "카테고리 목록을 불러오지 못했습니다." };
            }
            const { categories: newCategories, tabs: newTabs } = await res_get.json();
            setCategories(newCategories.map(toCategory));
            setTabs(newTabs.map(toUIViewTabs));
        }

        // 3. 수정된 북마크 재요청
        const res_get = await fetch("/bookmarks/api/bookmark");
        if (!res_get.ok) {
            return { ok: false, error: "북마크 목록을 불러오지 못했습니다." };
        }
        const { bookmarks: newBookmarks } = await res_get.json();
        setBookmarks(newBookmarks.map(toBookmarks));

        return { ok: true, data: updatedBookmark }; 
    } catch (e) {
        console.log(e);
        return { ok: false, error: "알 수 없는 에러가 발생했습니다." };
    }
   
}