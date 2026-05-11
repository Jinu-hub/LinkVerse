import { asc, eq } from "drizzle-orm";

import db from "~/core/db/drizzle-client.server";
import { profiles } from "~/features/users/schema";

import { blogComment, blogPostLike } from "./schema";

export async function getBlogPostLikeCountByPostKey(postKey: string): Promise<number> {
  const rows = await db
    .select({ like_count: blogPostLike.like_count })
    .from(blogPostLike)
    .where(eq(blogPostLike.post_key, postKey))
    .limit(1);
  return rows[0]?.like_count ?? 0;
}

export interface BlogCommentRow {
  blog_comment_id: number;
  post_key: string;
  body: string;
  parent_comment_id: number | null;
  created_at: Date;
  user_id: string | null;
  guest_name: string | null;
  profile_name: string | null;
}

export async function getBlogCommentsByPostKey(postKey: string): Promise<BlogCommentRow[]> {
  return db
    .select({
      blog_comment_id: blogComment.blog_comment_id,
      post_key: blogComment.post_key,
      body: blogComment.body,
      parent_comment_id: blogComment.parent_comment_id,
      created_at: blogComment.created_at,
      user_id: blogComment.user_id,
      guest_name: blogComment.guest_name,
      profile_name: profiles.name,
    })
    .from(blogComment)
    .leftJoin(profiles, eq(blogComment.user_id, profiles.profile_id))
    .where(eq(blogComment.post_key, postKey))
    .orderBy(asc(blogComment.created_at));
}
