import type { Route } from "./+types/category";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmarkCategories, 
    getMaxCategorySortOrder, 
    getUIViewTabs, 
    isExistsCategoryName } from "../db/queries";
import { createBookmarkCategory } from "../db/mutations";

const categorySchema = z.object({
    name: z.string().min(1),
    parent_id: z.number().nullable().optional(),
    level: z.number().nullable().optional(),
    sort_order: z.number().nullable().optional(),
  });

// GET: 전체 카테고리 조회
export const loader = async ({ params, request }: { params: { id: number }, request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const categoryId = params.id;
  if (categoryId) {
    const id = Number(categoryId);
    if (isNaN(id)) {
      return new Response("Invalid category id", { status: 400 });
    }
    //const category = await getBookmarkCategory(client, { userId: user.id, categoryId });
    const category = {
      id: id,
      name: "test",
      parent_id: null,
      level: 1,
      sort_order: 0,
    };
    return new Response(JSON.stringify(category), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const categories = await getBookmarkCategories(client, { userId: user.id });
  const tabs = await getUIViewTabs(client, { userId: user!.id });

  return new Response(JSON.stringify({ categories, tabs }), {
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Add Category API
 * @param request 
 * @returns 
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }
  const { name, parent_id, level, sort_order } = parsed.data;

  try {
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

    // 최대 정렬 순서 조회
    const maxSortOrder = await getMaxCategorySortOrder(client, {
         userId: user.id, parent_id: parent_id ?? null });

    // 카테고리 생성
    await createBookmarkCategory(client, {
      userId: user.id,
      name,
      parent_id: parent_id ?? null,
      level: level ?? 1,
      sort_order: sort_order ?? Number(maxSortOrder) + 1,
    });
    
    return data({ success: true }, { status: 200 });
  } catch (error: any) {
    return data({ error: error.message }, { status: 400 });
  }
};


