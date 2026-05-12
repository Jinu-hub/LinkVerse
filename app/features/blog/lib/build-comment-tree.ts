import type { BlogEngagementComment } from "~/features/blog/lib/serialize-engagement-comments";

export type CommentTreeNode = BlogEngagementComment & {
  children: CommentTreeNode[];
};

/** Flat list (e.g. by `created_at`) → forest for threaded UI. Orphans attach as roots. */
export function buildCommentTree(flat: BlogEngagementComment[]): CommentTreeNode[] {
  const byId = new Map<number, CommentTreeNode>();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots: CommentTreeNode[] = [];
  for (const c of flat) {
    const node = byId.get(c.id)!;
    const p = c.parentCommentId;
    if (p != null && byId.has(p)) {
      byId.get(p)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
