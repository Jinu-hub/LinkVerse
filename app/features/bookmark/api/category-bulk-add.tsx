import type { Route } from "./+types/category-bulk-add";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";
import { createNewCategory } from "../lib/common";
import { getBookmarkCategories } from "../db/queries";

const categoryBulkSchema = z.object({
  paths: z.array(z.string().min(1)),
});

export const meta: Route.MetaFunction = () => {
  return [{ title: `Bulk Add Categories | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function action({ request }: { request: Request }) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const parsed = categoryBulkSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }

  // ユニーク化 & 空白正規化
  const rawPaths = Array.from(
    new Set(
      parsed.data.paths
        .map((p) =>
          p
            .split(">")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join(" > ")
        )
        .filter((p) => p.length > 0)
    )
  );

  // 既存カテゴリを一括取得し、検索用マップを構築
  const existing = await getBookmarkCategories(client, { userId: user.id });
  type Cat = {
    category_id: number;
    category_name: string;
    parent_category_id: number | null;
    level: number | null;
  };

  const byParentAndName = new Map<string, Cat>();
  for (const c of existing as any as Cat[]) {
    const key = `${c.parent_category_id ?? "null"}|${c.category_name}`;
    byParentAndName.set(key, c);
  }

  // 作成後のID解決用: パス -> ID
  const pathToId = new Map<string, number>();

  // レベル順で安定的に処理
  const sorted = rawPaths
    .map((p) => ({ path: p, level: p.length === 0 ? 0 : p.split(" > ").length }))
    .sort((a, b) => a.level - b.level);

  const results: Array<{ path: string; category_id: number; created: boolean }> = [];

  try {
    for (const { path, level } of sorted) {
      const parts = path.split(" > ");
      let parentId: number | null = null;
      let parentPath: string | null = null;

      // 親のIDを上から順に解決
      for (let i = 0; i < parts.length - 1; i++) {
        const ancestorPath = parts.slice(0, i + 1).join(" > ");
        let ancestorId = pathToId.get(ancestorPath) ?? null;
        if (ancestorId == null) {
          // DBにも存在するか確認
          const ancestorName = parts[i];
          const key = `${i === 0 ? "null" : pathToId.get(parts.slice(0, i).join(" > ")) ?? "null"}|${ancestorName}`;
          const hit = byParentAndName.get(key);
          if (hit) {
            ancestorId = hit.category_id;
            pathToId.set(ancestorPath, ancestorId);
          }
        }
        if (ancestorId == null) {
          // 親が無ければ先に作る
          const ancestorName = parts[i];
          const created = await createNewCategory(client, {
            userId: user.id,
            name: ancestorName,
            parent_id: i === 0 ? null : pathToId.get(parts.slice(0, i).join(" > ")) ?? null,
            level: i + 1,
          });
          ancestorId = created.category_id as number;
          pathToId.set(ancestorPath, ancestorId);
          const key = `${i === 0 ? "null" : pathToId.get(parts.slice(0, i).join(" > ")) ?? "null"}|${ancestorName}`;
          byParentAndName.set(key, created as any);
        }
        parentId = ancestorId;
        parentPath = ancestorPath;
      }

      const name = parts[parts.length - 1];
      const key = `${parentId ?? "null"}|${name}`;
      const hit = byParentAndName.get(key);
      if (hit) {
        // 既存
        const fullPath = path;
        pathToId.set(fullPath, hit.category_id);
        results.push({ path: fullPath, category_id: hit.category_id, created: false });
        continue;
      }

      // 作成
      const created = await createNewCategory(client, {
        userId: user.id,
        name,
        parent_id: parentId,
        level: level,
      });
      const createdId = (created as any).category_id as number;
      const fullPath = path;
      pathToId.set(fullPath, createdId);
      byParentAndName.set(key, created as any);
      results.push({ path: fullPath, category_id: createdId, created: true });
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: sorted.length,
        created: results.filter((r) => r.created).length,
        existed: results.filter((r) => !r.created).length,
        results,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Bulk category creation error:", error);
    return new Response(
      JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
      { status: 400 }
    );
  }
}


