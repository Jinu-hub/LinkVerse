import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmarkCategories } from "../db/queries";
import { getBookmarkTagsAndMemo, findCategoryPath, toCategory } from "../lib/bmUtils";


export const loader = async ({ request }: { request: Request }) => {
    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });
  
    const categories = await getBookmarkCategories(client, { userId: user!.id });
    const bookmarksWithTagsMemo = await getBookmarkTagsAndMemo(client, { userId: user!.id });
  
    // 카테고리 데이터를 Category 타입으로 변환
    const convertedCategories = categories.map(cat => toCategory(cat));
  
    // 각 북마크에 카테고리 계층 구조 정보 추가
    const bookmarksWithCategoryPath = bookmarksWithTagsMemo.map(bookmark => {
      let categoryPath: { id: number; name: string }[] = [];
      let categoryPathString = '';
      
      if (bookmark.category_id) {
        categoryPath = findCategoryPath(bookmark.category_id, convertedCategories);
        categoryPathString = categoryPath.map(cat => cat.name).join(' > ');
      }
      
      return {
        ...bookmark,
        categoryPathString: categoryPathString
      };
    });
    return new Response(JSON.stringify({ bookmarksWithTagsMemo: bookmarksWithCategoryPath }), {
      headers: { "Content-Type": "application/json" },
    });
  }