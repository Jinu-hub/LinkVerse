import type { Route } from "./+types/bookmark-edit";

import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmark } from "../db/queries";
import { bookmarkSchema } from "../lib/constants";
import { deleteBookmark, updateBookmark } from "../db/mutations";
import { 
    createBookmarkResult, 
    createNewCategory, 
    handleBookmarkMemo, 
    handleContentTags,
} from "../lib/common";
import { deleteMemo } from "~/features/memo/db/mutations";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });
  
    const bookmarkId = Number(params.id);
    if (isNaN(bookmarkId)) {
        return new Response("Invalid bookmark id", { status: 400 });
    }

    const bookmark = await getBookmark(client, { userId: user.id, bookmarkId: bookmarkId });
  
    return new Response(JSON.stringify({ bookmark }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "PUT" && request.method !== "PATCH" && request.method !== "DELETE") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });
  
    const bookmarkId = Number(params.id);
    if (isNaN(bookmarkId)) {
      return new Response("Invalid bookmark id", { status: 400 });
    }

    try {
        if ( bookmarkId && 
            (request.method === "PUT" || request.method === "PATCH")) {
            const body = await request.json();
            const parsed = bookmarkSchema.safeParse(body);
            if (!parsed.success) {
                return new Response("Invalid data", { status: 400 });
            }
            let { title, url, tags, categoryId, memo, newCategoryName, parentCategoryId, newCategoryLevel } = parsed.data;

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

            // 북마크 수정
            const updatedBookmark = await updateBookmark(client, {
                user_id: user.id,
                bookmark_id: bookmarkId,
                category_id: categoryId ?? 0,
                title: title,
                url: url,
            });

            // 태그 수정
            let resTags: string[] = [];
            if (tags) {
                const tagsData = await handleContentTags(client, {
                    userId: user.id,
                    content_type_id: 1,
                    target_id: bookmarkId,
                    tags: tags,
                    mode: "update",
                });
                resTags = tagsData.map(tag => tag.tag_name);
            }

            // 메모 수정
            let resMemo: string = "";
            if (memo) {
                const memoData = await handleBookmarkMemo(client, {
                    userId: user.id,
                    target_id: bookmarkId,
                    content: memo,
                    isUpdate: true,
                });
                resMemo = memoData?.content ?? "";
            }

            const bookmarkResult = createBookmarkResult(updatedBookmark, resTags, resMemo);
            return new Response(JSON.stringify({ bookmark: bookmarkResult }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (bookmarkId && request.method === "DELETE") {
            // 북마크 삭제
            await deleteBookmark(client, {
                user_id: user.id,
                bookmark_id: bookmarkId,
            });
            // 메모 삭제
            await deleteMemo(client, {
                user_id: user.id,
                content_type_id: 1,
                target_id: bookmarkId,
            });
            // 콘텐츠와 태그 연결:삭제
            const body = await request.json();
            const { tags } = body;
            if (tags) {
                await handleContentTags(client, {
                    userId: user.id,
                    content_type_id: 1,
                    target_id: bookmarkId,
                    tags: tags,
                    mode: "delete",
                });
            }
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
        { status: 400 }
      );
    }
  }