import type { Route } from "./+types/bookmark-bulk-add";
import makeServerClient from "~/core/lib/supa-client.server";
import { createBookmark } from "../db/mutations";
import { handleContentTags, handleBookmarkMemo } from "../lib/common";
import { fetchTitleFromUrl } from "../lib/bmUtils";
import { bookmarkSchema } from "../lib/constants";

// 북마크 리스트를 위한 스키마
const bookmarkListSchema = {
  bookmarks: bookmarkSchema.array()
};

export const meta: Route.MetaFunction = () => {
  return [{ title: `Bulk Add Bookmarks | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function action({ request }: { request: Request }) {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();

  // 북마크 리스트 파싱
  const parsed = bookmarkListSchema.bookmarks.safeParse(body.bookmarks);
  if (!parsed.success) {
    console.log('=== bulk createBookmark invalid data ===', parsed.error);
    return new Response("Invalid data", { status: 400 });
  }

  const bookmarks = parsed.data;
  const results = [];

  try {
    for (const bookmarkData of bookmarks) {
      let { title, url, categoryId, tags, memo, description } = bookmarkData;
      
      try {
        // URL로부터 타이틀과 썸네일 이미지 추출
        const metadata = await fetchTitleFromUrl(url);
        const { title: titleFromUrl, image, description: descriptionFromUrl } = metadata;
        if (!title) {
          title = titleFromUrl ?? "";
        }
        if (!description) {
          description = descriptionFromUrl ?? "";
        }

        // 북마크 생성
        const bookmark = await createBookmark(client, {
          user_id: user.id,
          category_id: categoryId ?? 0,
          title: title,
          url,
          thumbnail_url: image ?? "",
          description: descriptionFromUrl ?? "",
        });

        // 태그 생성
        let resTags: string[] = [];
        if (tags && tags.length > 0) {
          const tagsData = await handleContentTags(client, {
            userId: user.id,
            content_type_id: 1,
            target_id: bookmark.bookmark_id,
            tags: tags,
            mode: "add",
          });
          resTags = tagsData.map(tag => tag.tag_name);
        }

        // 메모 생성
        let resMemo: string = "";
        if (memo) {
          const memoData = await handleBookmarkMemo(client, {
            userId: user.id,
            target_id: bookmark.bookmark_id,
            content: memo,
            isUpdate: false,
          });
          resMemo = memoData?.content ?? "";
        }

        results.push({
          success: true,
          bookmark: {
            bookmark_id: bookmark.bookmark_id,
            title: bookmark.title,
            url: bookmark.url,
            category_id: bookmark.category_id,
            tags: resTags,
            memo: resMemo,
            description: bookmark.description
          }
        });

      } catch (error) {
        console.error(`Error processing bookmark ${url}:`, error);
        results.push({
          success: false,
          url,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      total: bookmarks.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Bulk bookmark creation error:', error);
    return new Response(
      JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
      { status: 400 }
    );
  }
} 