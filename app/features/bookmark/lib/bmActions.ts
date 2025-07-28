import type { Bookmark, Category } from "./bookmark.types";
import { toCategory, toUIViewTabs, findRootCategoryId } from "./bmUtils";
import { bookmarkSchema } from "./constants";
import { toast } from "sonner";

export async function addBookmark({
    title,
    url,
    tags,
    categoryId,
    parentCategoryId,
    newCategoryName,
    newCategoryLevel,
    memo,
    setCategories,
    setTabs,
    setBookmarks,
    dispatch,
    selectedCategoryId,
}: {
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    newCategoryLevel: number;
    memo: string;
    setCategories: (categories: Category[]) => void;
    setTabs: (tabs: any[]) => void;
    setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
    dispatch: any;
    selectedCategoryId: number;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        categoryId,
        parentCategoryId,
        newCategoryLevel,
        newCategoryName,
        tags,
        memo,
    });
    if (!success) {
        const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
        // 스키마 레벨 에러가 있으면 schema 필드로 추가
        if (error.issues.some(issue => !issue.path.length)) {
            fieldErrors.schema = error.issues
                .filter(issue => !issue.path.length)
                .map(issue => issue.message);
        }
        return { ok: false, fieldErrors };
    }

    try {
        // 1. 북마크 추가
        const res = await fetch("/bookmarks/api/bookmark/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validData),
        });
        if (!res.ok) {
            return { ok: false, fieldErrors: { form: ["북마크 추가에 실패했습니다."] } };
        }
        const { bookmark: newBookmark } = await res.json();

        // 2. 전체 카테고리/탭 목록 재요청 (새로운 카테고리 추가 또는 선택된 카테고리 변경 시)
        if (newCategoryName || 
            (selectedCategoryId !== null && selectedCategoryId !== undefined &&
                selectedCategoryId !== newBookmark.categoryId)) {
            const res_get = await fetch("/bookmarks/api/category");
            if (!res_get.ok) {
                return { ok: false, error: "카테고리 목록을 불러오지 못했습니다." };
            }
            const { categories: newCategories, tabs: newTabs } = await res_get.json();
            const mappedCategories = newCategories.map(toCategory);
            setCategories(mappedCategories);
            setTabs(newTabs.map(toUIViewTabs));
            let targetId = newBookmark.categoryId;
            if ( newBookmark.parent_category_id !== null 
                && newBookmark.parent_category_id !== undefined) {
                targetId = findRootCategoryId(mappedCategories, targetId);
            }
            const tabId = newTabs.find((t: any) => t.category_id === targetId)?.ui_view_id;
            dispatch({ type: 'CHANGE_CATEGORY', payload: { categoryId: targetId, tabId: tabId } });
        }
        
        setBookmarks(prev => [newBookmark, ...prev]);
        toast.success("북마크가 추가되었습니다.");
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
    newCategoryLevel,
    memo,
    setCategories,
    setTabs,
    setBookmarks,
    dispatch,
    selectedCategoryId,
}: {
    id: number;
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    newCategoryLevel: number;
    memo: string;
    setCategories: (categories: Category[]) => void;
    setTabs: (tabs: any[]) => void;
    setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
    dispatch: any;
    selectedCategoryId: number;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        categoryId,
        parentCategoryId,
        newCategoryLevel,
        newCategoryName,
        tags,
        memo,
    });
    if (!success) {
        const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
        // 스키마 레벨 에러가 있으면 schema 필드로 추가
        if (error.issues.some(issue => !issue.path.length)) {
            fieldErrors.schema = error.issues
                .filter(issue => !issue.path.length)
                .map(issue => issue.message);
        }
        return { ok: false, fieldErrors };
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
        const { bookmark: updatedBookmark } = await res.json();

        // 2. 전체 카테고리/탭 목록 재요청 (새로운 카테고리 추가 또는 선택된 카테고리 변경 시)
        if (newCategoryName || 
            (selectedCategoryId !== null && selectedCategoryId !== undefined &&
                selectedCategoryId !== updatedBookmark.categoryId)) {
            const res_get = await fetch("/bookmarks/api/category");
            if (!res_get.ok) {
                return { ok: false, error: "카테고리 목록을 불러오지 못했습니다." };
            }
            const { categories: newCategories, tabs: newTabs } = await res_get.json();
            const mappedCategories = newCategories.map(toCategory);
            setCategories(mappedCategories);
            setTabs(newTabs.map(toUIViewTabs));
            let targetId = findRootCategoryId(mappedCategories, updatedBookmark.categoryId);
            const tabId = newTabs.find((t: any) => t.category_id === targetId)?.ui_view_id;
            dispatch({ type: 'CHANGE_CATEGORY', payload: { categoryId: targetId, tabId: tabId } });
        }

        setBookmarks(prev => prev.map(b => b.id === id ? updatedBookmark : b));
        toast.success("북마크가 수정되었습니다.");
        return { ok: true, data: updatedBookmark }; 
    } catch (e) {
        console.log(e);
        return { ok: false, error: "알 수 없는 에러가 발생했습니다." };
    }
   
}

export async function deleteBookmark({
    id,
    setBookmarks,
    tags,
}: {
    id: number;
    setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
    tags: string[];
}) {
    const res = await fetch(`/bookmarks/api/bookmark/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
    });
    if (!res.ok) {
        return { ok: false, error: "북마크 삭제에 실패했습니다." };
    }
    setBookmarks(prev => prev.filter(b => b.id !== id));
    toast.success("북마크가 삭제되었습니다.");
    return { ok: true };
}


export async function updateBookmarkClickCount(
    id: number, 
    setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>
) {
    const res = await fetch(`/bookmarks/api/bookmark-click/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        return { ok: false, error: "북마크 클릭 수 업데이트에 실패했습니다." };
    }
    const { updatedActivity } = await res.json();
    setBookmarks(prev =>
        prev.map(b =>
            b.id === updatedActivity.target_id
            ? { ...b, click_count: updatedActivity.value }
            : b
        )
    );
    return { ok: true };
}