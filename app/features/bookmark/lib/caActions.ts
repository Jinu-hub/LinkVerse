import { toBookmarks } from "./bmUtils";

/**
 * Add a category
 * @param name Category name
 * @param setCategories Function to set the category list
 * @param setTabs Function to set the tab list
 * @param setError Function to set the error message
 * @param dispatch State management function
 * @param toCategory Function to convert to category type
 * @param toUIViewTabs Function to convert to UI view tab type
 * @param setSubmitting Function to set the submitting state
 * @param parent_id Parent category ID
 * @param level Category level
 * @param sort_order Sort order
 */
export async function addCategory({
    name,
    setCategories,
    setTabs,
    setError,
    dispatch,
    toCategory,
    toUIViewTabs,
    setSubmitting,
    parent_id,
    level,
    sort_order,
  }: {
    name: string;
    setCategories: (cats: any[]) => void;
    setTabs: (tabs: any[]) => void;
    setError: (msg: string) => void;
    dispatch: any;
    toCategory: (cat: any) => any;
    toUIViewTabs: (tab: any) => any;
    setSubmitting: (b: boolean) => void;
    parent_id?: number;
    level?: number;
    sort_order?: number;
  }) {
    if (!name) return;
    setSubmitting(true);
    setError("");
    try {
      // 1. 새 카테고리 추가 요청
      const res_add = await fetch("/bookmarks/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name, 
            parent_id: parent_id ?? null, 
            level: level ?? 1, 
            sort_order: sort_order ?? null }),
      });
  
      if (!res_add.ok) {
        const { error } = await res_add.json();
        setError(error || "카테고리 추가에 실패했습니다.");
        return;
      }
  
      // 2. 전체 카테고리/탭 목록 재요청
      const res_get = await fetch("/bookmarks/api/category");
      if (!res_get.ok) {
        setError("카테고리 목록을 불러오지 못했습니다.");
        return;
      }
      const { categories: newCategories, tabs: newTabs } = await res_get.json();
      setCategories(newCategories.map(toCategory));
      setTabs(newTabs.map(toUIViewTabs));

      // 3. 상태 갱신 및 입력창 닫기
      dispatch({ type: "SET_CATEGORIES", categories: newCategories });
      dispatch({ type: "CANCEL" });
    } catch (e) {
      console.log(e);
      setError("알 수 없는 에러가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  export async function updateCategoryName({
    name,
    setCategories,
    setTabs,
    setError,
    dispatch,
    toCategory,
    toUIViewTabs,
    setSubmitting,
    category_id,
    parent_id,
  }: {
    name: string;
    setCategories: (cats: any[]) => void;
    setTabs: (tabs: any[]) => void;
    setError: (msg: string) => void;
    dispatch: any;
    toCategory: (cat: any) => any;
    toUIViewTabs: (tab: any) => any;
    setSubmitting: (b: boolean) => void;
    category_id: number;
    parent_id?: number;
  }) {
    if (!name) return;
    setSubmitting(true);
    setError("");
    try {
      // 1. 카테고리 업데이트 요청
      const res_update = await fetch(`/bookmarks/api/category/${category_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            parent_id: parent_id ?? null,
        }),
      });

      if (!res_update.ok) {
        const { error } = await res_update.json();
        setError(error || "카테고리 이름 변경에 실패했습니다.");
        return;
      }

      // 2. 전체 카테고리/탭 목록 재요청
      const res_get = await fetch("/bookmarks/api/category");
      if (!res_get.ok) {
        setError("카테고리 목록을 불러오지 못했습니다.");
        return;
      }
      const { categories: newCategories, tabs: newTabs } = await res_get.json();
      setCategories(newCategories.map(toCategory));
      setTabs(newTabs.map(toUIViewTabs));

      // 3. 상태 갱신 및 입력창 닫기
      dispatch({ type: "SET_CATEGORIES", categories: newCategories });
      dispatch({ type: "CANCEL" });
    } catch (e) {
      console.log(e);
      setError("알 수 없는 에러가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  export async function deleteCategory({
    category_id,
    setCategories,
    setTabs,
    setBookmarks,
    dispatch,
    toCategory,
    toUIViewTabs,
  }: {
    category_id: number;
    setCategories: (cats: any[]) => void;
    setTabs: (tabs: any[]) => void;
    setBookmarks: (bookmarks: any[]) => void;
    dispatch: any;
    toCategory: (cat: any) => any;
    toUIViewTabs: (tab: any) => any;
  }) {
    if (!category_id) return;
    //setSubmitting(true);
    //setError("");
    try {
      // 1. 카테고리 삭제 요청
      const res_delete = await fetch(`/bookmarks/api/category/${category_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res_delete.ok) {
        const { error } = await res_delete.json();
        //setError(error || "카테고리 삭제에 실패했습니다.");
        return;
      }

      // 2. 전체 카테고리/탭/북마크 목록 재요청
      const res_get = await fetch(`/bookmarks/api/category/${category_id}`);
      if (!res_get.ok) {
        //setError("카테고리 목록을 불러오지 못했습니다.");
        return;
      }
      const { categories: newCategories, tabs: newTabs, bookmarksWithTagsMemo: newBookmarks } = await res_get.json();
      setCategories(newCategories.map(toCategory));
      setTabs(newTabs.map(toUIViewTabs));
      console.log('newBookmarks', newBookmarks.length);
      setBookmarks(newBookmarks.map(toBookmarks));

      // 3. 상태 갱신 및 입력창 닫기
      dispatch({ type: "SET_CATEGORIES", categories: newCategories });
      dispatch({ type: "CANCEL" });
    } catch (e) {
      console.log(e);
      //setError("알 수 없는 에러가 발생했습니다.");
    } finally {
      //setSubmitting(false);
    }
  }
  