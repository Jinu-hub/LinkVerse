export interface BlogEngagementComment {
  id: number;
  body: string;
  authorDisplay: string;
  createdAt: string;
  parentCommentId: number | null;
}

export function serializeEngagementComments(
  rows: Array<{
    blog_comment_id: number;
    body: string;
    parent_comment_id: number | null;
    created_at: Date;
    user_id: string | null;
    guest_name: string | null;
    profile_name: string | null;
  }>,
): BlogEngagementComment[] {
  return rows.map((row) => ({
    id: row.blog_comment_id,
    body: row.body,
    parentCommentId: row.parent_comment_id,
    createdAt: row.created_at.toISOString(),
    authorDisplay:
      row.guest_name?.trim() ||
      row.profile_name?.trim() ||
      (row.user_id ? `…${row.user_id.slice(0, 8)}` : ""),
  }));
}
