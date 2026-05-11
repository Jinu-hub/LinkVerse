import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "~/core/db/drizzle-client.server";

import { blogComment, blogPostLike } from "./schema";

const postKeySchema = z.string().trim().min(1).max(160);

const likeBodySchema = z.object({
  postKey: postKeySchema,
});

const commentBodySchema = z.object({
  postKey: postKeySchema,
  body: z.string().trim().min(1).max(8000),
  guestName: z.string().trim().max(120).optional(),
  parentCommentId: z.union([z.number().int().positive(), z.null()]).optional(),
});

export async function incrementBlogPostLike(postKey: string): Promise<number> {
  postKeySchema.parse(postKey);
  await db
    .insert(blogPostLike)
    .values({
      post_key: postKey,
      like_count: 1,
    })
    .onConflictDoUpdate({
      target: blogPostLike.post_key,
      set: {
        like_count: sql`${blogPostLike.like_count} + 1`,
        updated_at: new Date(),
      },
    });

  const rows = await db
    .select({ like_count: blogPostLike.like_count })
    .from(blogPostLike)
    .where(eq(blogPostLike.post_key, postKey))
    .limit(1);
  return rows[0]?.like_count ?? 0;
}

export async function insertBlogComment(input: {
  postKey: string;
  body: string;
  userId: string | null;
  guestName: string | null;
  parentCommentId?: number | null;
}): Promise<void> {
  const parsed = commentBodySchema.parse({
    postKey: input.postKey,
    body: input.body,
    guestName: input.guestName ?? undefined,
    parentCommentId: input.parentCommentId ?? undefined,
  });

  if (parsed.parentCommentId != null) {
    const parent = await db
      .select({ id: blogComment.blog_comment_id, post_key: blogComment.post_key })
      .from(blogComment)
      .where(eq(blogComment.blog_comment_id, parsed.parentCommentId))
      .limit(1);
    if (!parent[0] || parent[0].post_key !== parsed.postKey) {
      throw new Error("Invalid parent comment");
    }
  }

  if (input.userId) {
    await db.insert(blogComment).values({
      post_key: parsed.postKey,
      body: parsed.body,
      user_id: input.userId,
      guest_name: null,
      parent_comment_id: parsed.parentCommentId ?? null,
    });
  } else {
    const guest = (parsed.guestName ?? "").trim();
    if (!guest) {
      throw new Error("Guest name required");
    }
    await db.insert(blogComment).values({
      post_key: parsed.postKey,
      body: parsed.body,
      user_id: null,
      guest_name: guest,
      parent_comment_id: parsed.parentCommentId ?? null,
    });
  }
}

export function parseLikeRequestBody(json: unknown) {
  return likeBodySchema.safeParse(json);
}

export function parseCommentRequestBody(json: unknown) {
  return commentBodySchema.safeParse(json);
}
