import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmark } from "../db/queries";
import { bookmarkSchema } from "../lib/constants";
import { fetchTitleFromUrl } from "../lib/bmUtils";
import { createBookmark } from "../db/mutations";
import { createMemo } from "~/features/memo/db/mutations";
import { createNewCategory, handleBookmarkTags } from "../lib/common";
import type { Bookmark } from "../types/bookmark.types";

export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { bookmarkId } = await request.json();
  const bookmark = await getBookmark(client, { userId: user.id, bookmarkId: bookmarkId });

  return new Response(JSON.stringify({ bookmark }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }: { request: Request }) {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();

  const parsed = bookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }

  let { title, url, categoryId, parentCategoryId, newCategoryName, newCategoryLevel, tags, memo } = parsed.data;
  
  try {
    // URL로부터 타이틀과 썸네일 이미지 추출
    const metadata = await fetchTitleFromUrl(url);
    const { title: titleFromUrl, image, description } = metadata;
    if (!title) {
      title = titleFromUrl ?? "";
    }

    // 새 카테고리 이름이 있으면 생성
    if (newCategoryName) {
      const newCategory = await createNewCategory(client, {
        userId: user.id,
        name: newCategoryName,
        parent_id: parentCategoryId ?? null,
        level: newCategoryLevel ?? 1,
      });
      categoryId = newCategory.category_id;
    }
    
    // 북마크 생성
    const bookmark = await createBookmark(client, {
      user_id: user.id,
      category_id: categoryId ?? 0,
      title: title,
      url,
      thumbnail_url: image ?? "",
      description: description ?? "",
    });

    // 태그 생성
    let resTags: string[] = [];
    if (tags) {
      const tagsData = await handleBookmarkTags(client, {
        userId: user.id,
        bookmarkId: bookmark.bookmark_id,
        tags: tags,
        isUpdate: false,
      });
      resTags = tagsData.map(tag => tag.tag_name);
    }

    // 메모 생성
    let resMemo: string = "";
    if (memo) {
      const memoData = await createMemo(client, {
        user_id: user.id,
        content_type_id: 1,
        target_id: bookmark.bookmark_id,
        content: memo,
      });
      resMemo = memoData?.content ?? "";
    }

    const bookmarkResult: Bookmark = {
      id: bookmark.bookmark_id,
      url: bookmark.url as string,
      title: bookmark.title ?? "",
      categoryId: bookmark.category_id ?? 0,
      created_at: bookmark.created_at,
      updated_at: bookmark.updated_at,
      click_count: 0,
      tags: resTags,
      memo: resMemo,
    };

    return new Response(JSON.stringify({ success: true, bookmark: bookmarkResult }), {
        headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
      { status: 400 }
    );
  }
}