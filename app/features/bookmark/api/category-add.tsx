import type { Route } from "./+types/category-add";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmarkCategories, getUIViewTabs, isExistsCategoryName } from "../db/queries";
import { createNewCategory } from "../lib/common";

const categorySchema = z.object({
    name: z.string().min(1),
    parent_id: z.number().nullable().optional(),
    level: z.number().nullable().optional(),
    sort_order: z.number().nullable().optional(),
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
  const { name, parent_id, level } = parsed.data;

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

    await createNewCategory(client, {
      userId: user.id,
      name,
      parent_id: parent_id ?? null,
      level: level ?? 1,
    });
     
    return data({ success: true }, { status: 200 });
  } catch (error: any) {
    return data({ error: error.message }, { status: 400 });
  }
};


