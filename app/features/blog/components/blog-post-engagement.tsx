import { Loader2Icon, MessageCircle, Reply, Send, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/core/components/ui/button";
import { cn } from "~/core/lib/utils";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";
import { buildCommentTree, type CommentTreeNode } from "~/features/blog/lib/build-comment-tree";
import type { BlogEngagementComment } from "~/features/blog/lib/serialize-engagement-comments";

type LikeActionData = { ok?: boolean; likeCount?: number; error?: string };
type CommentActionData = {
  ok?: boolean;
  comments?: BlogEngagementComment[];
  error?: string;
};

/** Two-letter avatar fallback from display name (Latin / CJK friendly enough for blog UI). */
function commentAuthorInitials(name: string): string {
  const s = name.trim();
  if (!s) return "?";
  const compact = s.replace(/\s+/g, "");
  if (compact.length <= 2) return compact.toLocaleUpperCase();
  return compact.slice(0, 2).toLocaleUpperCase();
}

interface CommentThreadNodeProps {
  node: CommentTreeNode;
  depth: number;
  replyingTo: { id: number; authorDisplay: string } | null;
  onReply: (commentId: number, authorDisplay: string) => void;
}

function CommentThreadNode({ node, depth, replyingTo, onReply }: CommentThreadNodeProps) {
  const { t } = useTranslation();
  const isReplyTarget = replyingTo?.id === node.id;

  return (
    <li className="list-none">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border/70 bg-card/35 shadow-sm ring-1 ring-black/[0.03] transition-[border-color,box-shadow,background-color] motion-safe:duration-150 hover:border-border hover:bg-card/55 hover:shadow-md dark:bg-card/20 dark:ring-white/[0.06] dark:hover:bg-card/35",
          isReplyTarget && "border-primary/45 ring-2 ring-primary/30",
        )}
      >
        <div className="flex gap-4 p-4 md:gap-5 md:p-5">
          <div className="shrink-0 pt-0.5" aria-hidden>
            <div
              className="flex size-11 items-center justify-center rounded-full border border-border/70 bg-gradient-to-b from-secondary/90 to-secondary/60 text-[0.6875rem] font-bold leading-none tracking-tight text-secondary-foreground shadow-inner"
              title={node.authorDisplay}
            >
              {commentAuthorInitials(node.authorDisplay)}
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-sm font-semibold text-foreground md:text-[15px]">
                {node.authorDisplay}
              </span>
              <span
                className="text-muted-foreground/80 hidden h-1 w-1 shrink-0 rounded-full bg-current sm:inline"
                aria-hidden
              />
              <time
                className="text-muted-foreground text-xs tabular-nums sm:text-[13px]"
                dateTime={node.createdAt}
              >
                {new Date(node.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/95 md:text-[15px]">
              {node.body}
            </p>
          </div>
        </div>
        <div className="flex justify-end border-t border-border/45 px-4 pb-3 pt-2 md:px-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => onReply(node.id, node.authorDisplay)}
          >
            <Reply className="size-3.5 shrink-0" aria-hidden />
            {t("blog.posts.engagement.replyButton")}
          </Button>
        </div>
      </div>
      {node.children.length > 0 ? (
        <ul
          className={cn(
            "mt-3 space-y-3 border-l-2 border-border/30 pl-3 md:mt-4 md:pl-5",
            depth >= 6 && "border-l-transparent pl-0",
          )}
        >
          {node.children.map((child) => (
            <CommentThreadNode
              key={child.id}
              node={child}
              depth={depth + 1}
              replyingTo={replyingTo}
              onReply={onReply}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

interface BlogPostEngagementProps {
  postKey: string;
  initialLikeCount: number;
  initialComments: BlogEngagementComment[];
  isAuthenticated: boolean;
}

export default function BlogPostEngagement({
  postKey,
  initialLikeCount,
  initialComments,
  isAuthenticated,
}: BlogPostEngagementProps) {
  const { t } = useTranslation();
  const likeFetcher = useFetcher<LikeActionData>();
  const commentFetcher = useFetcher<CommentActionData>();

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [comments, setComments] = useState(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [guestName, setGuestName] = useState("");
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: number; authorDisplay: string } | null>(null);

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  /** Only react when a fetcher submission finishes (idle after loading/submitting), not on every `t`/parent re-render. */
  const prevLikeFetcherState = useRef(likeFetcher.state);
  const prevCommentFetcherState = useRef(commentFetcher.state);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    const wasBusy = prevLikeFetcherState.current !== "idle";
    prevLikeFetcherState.current = likeFetcher.state;
    if (likeFetcher.state !== "idle" || !wasBusy) return;

    const data = likeFetcher.data;
    if (!data) return;
    if (data.error || data.ok === false) {
      setLikeError(t("blog.posts.engagement.errorGeneric"));
      return;
    }
    if (typeof data.likeCount === "number") {
      setLikeError(null);
      setLikeCount(data.likeCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `t` can churn in dev; only re-run on fetcher completion / payload
  }, [likeFetcher.state, likeFetcher.data]);

  useEffect(() => {
    const wasBusy = prevCommentFetcherState.current !== "idle";
    prevCommentFetcherState.current = commentFetcher.state;
    if (commentFetcher.state !== "idle" || !wasBusy) return;

    const data = commentFetcher.data;
    if (!data) return;
    if (data.error === "guest_name_required") {
      setCommentError(t("blog.posts.engagement.guestNameRequired"));
      return;
    }
    if (data.error) {
      setCommentError(t("blog.posts.engagement.errorGeneric"));
      return;
    }
    if (data.ok && data.comments) {
      setCommentError(null);
      setComments(data.comments);
      setCommentBody("");
      setGuestName("");
      setReplyingTo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see like fetcher effect
  }, [commentFetcher.state, commentFetcher.data]);

  function handleLike() {
    setLikeError(null);
    likeFetcher.submit(JSON.stringify({ postKey }), {
      method: "POST",
      action: "/blog/api/like",
      encType: "application/json",
    });
  }

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCommentError(null);
    const body = commentBody.trim();
    if (!body) {
      setCommentError(t("blog.posts.engagement.commentEmpty"));
      return;
    }
    if (!isAuthenticated && !guestName.trim()) {
      setCommentError(t("blog.posts.engagement.guestNameRequired"));
      return;
    }

    const payload: {
      postKey: string;
      body: string;
      guestName?: string;
      parentCommentId?: number;
    } = { postKey, body };
    if (!isAuthenticated) {
      payload.guestName = guestName.trim();
    }
    if (replyingTo) {
      payload.parentCommentId = replyingTo.id;
    }
    commentFetcher.submit(JSON.stringify(payload), {
      method: "POST",
      action: "/blog/api/comment",
      encType: "application/json",
    });
  }

  const likePending = likeFetcher.state !== "idle";
  const commentPending = commentFetcher.state !== "idle";

  return (
    <section
      className="not-prose space-y-10 border-t border-border pt-10"
      aria-label={t("blog.posts.engagement.sectionAriaLabel")}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={likePending}
          aria-busy={likePending}
          aria-label={`${t("blog.posts.engagement.likeButton")} (${likeCount})`}
          onClick={() => handleLike()}
          className={cn(
            "group relative inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium tabular-nums shadow-sm transition-[transform,box-shadow,border-color,background-color] motion-safe:duration-150",
            "border-border/90 bg-card/90 text-foreground",
            "hover:border-rose-400/50 hover:bg-rose-500/[0.07] hover:shadow-md hover:shadow-rose-500/10",
            "active:scale-[0.97] motion-safe:active:duration-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-60",
            "dark:border-white/12 dark:bg-card/60 dark:hover:border-rose-400/35 dark:hover:bg-rose-500/[0.12] dark:hover:shadow-rose-500/15",
          )}
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center">
            {likePending ? (
              <Loader2Icon className="size-5 animate-spin text-muted-foreground" aria-hidden />
            ) : (
              <ThumbsUp
                className="relative z-[1] size-5 text-muted-foreground transition-[color,transform] motion-safe:duration-150 group-hover:scale-105 group-hover:text-rose-500"
                aria-hidden
              />
            )}
          </span>
          <span className="flex min-w-[2ch] items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight">{likeCount}</span>
            <span className="text-muted-foreground font-normal max-sm:sr-only">
              {t("blog.posts.engagement.likeButton")}
            </span>
          </span>
        </button>
        {likeError ? (
          <p className="text-destructive text-sm" role="alert">
            {likeError}
          </p>
        ) : null}
      </div>

      <div className="space-y-8">
        <div className="space-y-5">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-muted-foreground shadow-sm">
              <MessageCircle className="size-[1.125rem]" aria-hidden />
            </span>
            {t("blog.posts.engagement.commentsTitle")}
          </h2>
        <ul className="space-y-3">
          {comments.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-border/70 bg-muted/5 px-6 py-14 text-center ring-1 ring-black/[0.02] dark:ring-white/[0.04]">
              <MessageCircle
                className="mx-auto mb-3 size-10 stroke-[1.25] text-muted-foreground/45"
                aria-hidden
              />
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("blog.posts.engagement.noComments")}
              </p>
            </li>
          ) : (
            commentTree.map((node) => (
              <CommentThreadNode
                key={node.id}
                node={node}
                depth={0}
                replyingTo={replyingTo}
                onReply={(id, authorDisplay) => setReplyingTo({ id, authorDisplay })}
              />
            ))
          )}
        </ul>
        </div>

        <form
          onSubmit={handleCommentSubmit}
          className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4 shadow-sm ring-1 ring-black/[0.03] dark:bg-muted/5 dark:ring-white/[0.05] md:p-5"
        >
          {replyingTo ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm text-foreground">
              <span className="min-w-0 flex-1 font-medium">
                {t("blog.posts.engagement.replyingToHint", { name: replyingTo.authorDisplay })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 cursor-pointer"
                onClick={() => setReplyingTo(null)}
              >
                {t("blog.posts.engagement.cancelReply")}
              </Button>
            </div>
          ) : null}
          {!isAuthenticated ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="blog-comment-guest">
                {t("blog.posts.engagement.guestNameLabel")}
              </label>
              <Input
                id="blog-comment-guest"
                name="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={120}
                autoComplete="nickname"
                placeholder={t("blog.posts.engagement.guestNamePlaceholder")}
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="blog-comment-body">
              {t("blog.posts.engagement.commentLabel")}
            </label>
            <Textarea
              id="blog-comment-body"
              name="body"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              rows={4}
              maxLength={8000}
              placeholder={t("blog.posts.engagement.commentPlaceholder")}
            />
          </div>
          {commentError ? (
            <p className="text-destructive text-sm" role="alert">
              {commentError}
            </p>
          ) : null}
          <Button type="submit" disabled={commentPending} className="gap-2 cursor-pointer">
            {commentPending ? (
              <Loader2Icon className="size-4 animate-spin" aria-hidden />
            ) : (
              <>
                <Send className="size-4 shrink-0 opacity-90" aria-hidden />
                {t("blog.posts.engagement.submitComment")}
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
