import type { Route } from "./+types/category-edit";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";
import { 
  getBookmarkCategories, 
  getChildCategoryIds, 
  getUIViewTabs, 
  isExistsCategoryName } 
  from "../db/queries";
import { deleteBookmarkCategory, updateBookmarkCategoryName } from "../db/mutations";
import { deleteContentTags } from "~/features/tag/db/mutations";
import { deleteContentMemos } from "~/features/memo/db/mutations";
import { getBookmarkTagsAndMemo } from "../lib/bmUtils";
import { getTagIdsWithCategory } from "~/features/tag/db/queries";

const categorySchema = z.object({
    name: z.string().min(1),
    parent_id: z.number().nullable().optional(),
  });

// GET: 전체 카테고리 조회
export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const categories = await getBookmarkCategories(client, { userId: user.id });
  const tabs = await getUIViewTabs(client, { userId: user!.id });
  const bookmarksWithTagsMemo = await getBookmarkTagsAndMemo(client, { userId: user!.id });
  return new Response(JSON.stringify({ categories, tabs, bookmarksWithTagsMemo }), {
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Add Category API
 * @param request 
 * @returns 
 */
export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "PUT" && request.method !== "PATCH" && request.method !== "DELETE") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const category_id = Number(params.id);
  if (isNaN(category_id)) {
    return new Response("Invalid category id", { status: 400 });
  }

  try {

    if ( category_id && 
        (request.method === "PUT" || request.method === "PATCH")) {
      // 카테고리 이름 변경
      const body = await request.json();
      const parsed = categorySchema.safeParse(body);
      if (!parsed.success) {
        return new Response("Invalid data", { status: 400 });
      }
      const { name, parent_id } = parsed.data;

      // 같은 이름의 카테고리가 있는지 확인
      const isExists = await isExistsCategoryName(client, {
        userId: user.id,
        name,
        parent_id: parent_id ?? null,
      });
      if (isExists) {
        return new Response(JSON.stringify({ error: "같은 이름의 카테고리가 있습니다." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      await updateBookmarkCategoryName(client, {
        userId: user.id,
        name,
        categoryId: category_id,
      });
    }

    if (category_id && request.method === "DELETE") {
      // 카테고리 하위 카테고리 조회
      const categoryIds = await getChildCategoryIds(client, {
        parent_id: category_id,
      });
      const c_ids = categoryIds.map((categoryIdObj) => categoryIdObj.category_id);
      c_ids.push(category_id);
      // 카테고리 태그 조회
      const tag_ids = await getTagIdsWithCategory(client, {
        content_type_id: 1,
        category_ids: c_ids,
        userId: user.id,
      });
      // 카테고리 삭제
      await deleteBookmarkCategory(client, {
        userId: user.id,
        categoryId: category_id,
      });
      // 콘테츠에 연결된 태그 삭제
      await deleteContentTags(client, {
        userId: user.id,
        content_type_id: 1,
        tag_ids: tag_ids,
      });
      // 콘테츠에 연결된 매모 삭제
      await deleteContentMemos(client, {  
        userId: user.id,
        content_type_id: 1,
      });
    }

    return data({ success: true }, { status: 200 });
  } catch (error: any) {
    return data({ error: error.message }, { status: 400 });
  }
};


