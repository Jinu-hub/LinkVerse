import type { Route } from "./+types/post-like";

import { incrementBlogPostLike, parseLikeRequestBody } from "~/features/blog/db/mutations";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = parseLikeRequestBody(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "validation", issues: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const likeCount = await incrementBlogPostLike(parsed.data.postKey);
    return new Response(JSON.stringify({ ok: true, likeCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("incrementBlogPostLike", e);
    return new Response(JSON.stringify({ error: "server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
