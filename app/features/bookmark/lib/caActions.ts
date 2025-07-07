// utils/addCategory.ts (또는 category-tree.tsx 내부)
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