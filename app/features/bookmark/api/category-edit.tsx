import type { Route } from "./+types/category-edit";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmarkCategories, getUIViewTabs, isExistsCategoryName } from "../db/queries";
import { updateBookmarkCategoryName } from "../db/mutations";

const categorySchema = z.object({
    name: z.string().min(1),
    category_id: z.number(),
    parent_id: z.number().nullable().optional(),
  });

// GET: 전체 카테고리 조회
export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

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
  if (request.method !== "PUT" && request.method !== "PATCH") {
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
  const { name, category_id, parent_id } = parsed.data;
  console.log(name, category_id, parent_id);
  try {

    if ( category_id && 
        (request.method === "PUT" || request.method === "PATCH")) {
      // 카테고리 이름 변경

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
     
    return data({ success: true }, { status: 200 });
  } catch (error: any) {
    return data({ error: error.message }, { status: 400 });
  }
};


