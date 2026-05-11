import type { Route } from "./+types/post-comment";

import makeServerClient from "~/core/lib/supa-client.server";
import {
  insertBlogComment,
  parseCommentRequestBody,
} from "~/features/blog/db/mutations";
import { getBlogCommentsByPostKey } from "~/features/blog/db/queries";
import { serializeEngagementComments } from "~/features/blog/lib/serialize-engagement-comments";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = parseCommentRequestBody(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "validation", issues: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { postKey, body: textBody, guestName, parentCommentId } = parsed.data;

  if (user) {
    if (guestName != null && guestName.length > 0) {
      return new Response(JSON.stringify({ error: "guest_name_forbidden_when_auth" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      await insertBlogComment({
        postKey,
        body: textBody,
        userId: user.id,
        guestName: null,
        parentCommentId: parentCommentId ?? null,
      });
    } catch (e) {
      console.error("insertBlogComment", e);
      return new Response(JSON.stringify({ error: "server" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    const guest = (guestName ?? "").trim();
    if (!guest) {
      return new Response(JSON.stringify({ error: "guest_name_required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      await insertBlogComment({
        postKey,
        body: textBody,
        userId: null,
        guestName: guest,
        parentCommentId: parentCommentId ?? null,
      });
    } catch (e) {
      console.error("insertBlogComment", e);
      return new Response(JSON.stringify({ error: "server" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const comments = serializeEngagementComments(await getBlogCommentsByPostKey(postKey));
  return new Response(JSON.stringify({ ok: true, comments }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
