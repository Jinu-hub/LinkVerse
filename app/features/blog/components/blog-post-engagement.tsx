import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";
import type { BlogEngagementComment } from "~/features/blog/lib/serialize-engagement-comments";

type LikeActionData = { ok?: boolean; likeCount?: number; error?: string };
type CommentActionData = {
  ok?: boolean;
  comments?: BlogEngagementComment[];
  error?: string;
};

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
  const revalidator = useRevalidator();
  const likeFetcher = useFetcher<LikeActionData>();
  const commentFetcher = useFetcher<CommentActionData>();

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [comments, setComments] = useState(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [guestName, setGuestName] = useState("");
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    if (likeFetcher.state !== "idle") return;
    const data = likeFetcher.data;
    if (!data) return;
    if (data.error || data.ok === false) {
      setLikeError(t("blog.posts.engagement.errorGeneric"));
      return;
    }
    if (typeof data.likeCount === "number") {
      setLikeError(null);
      setLikeCount(data.likeCount);
      revalidator.revalidate();
    }
  }, [likeFetcher.state, likeFetcher.data, revalidator, t]);

  useEffect(() => {
    if (commentFetcher.state !== "idle") return;
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
      revalidator.revalidate();
    }
  }, [commentFetcher.state, commentFetcher.data, revalidator, t]);

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

    const payload: Record<string, string> = { postKey, body };
    if (!isAuthenticated) {
      payload.guestName = guestName.trim();
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
        <span className="text-muted-foreground text-sm tabular-nums">
          {t("blog.posts.engagement.likeCount", { count: likeCount })}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={likePending}
          onClick={() => handleLike()}
        >
          {likePending ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
          ) : (
            t("blog.posts.engagement.likeButton")
          )}
        </Button>
        {likeError ? (
          <p className="text-destructive text-sm" role="alert">
            {likeError}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("blog.posts.engagement.commentsTitle")}
        </h2>
        <ul className="space-y-4">
          {comments.length === 0 ? (
            <li className="text-muted-foreground text-sm">
              {t("blog.posts.engagement.noComments")}
            </li>
          ) : (
            comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm"
              >
                <div className="text-muted-foreground mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                  <span className="font-medium text-foreground">{c.authorDisplay}</span>
                  <time dateTime={c.createdAt}>
                    {new Date(c.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-foreground">{c.body}</p>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={handleCommentSubmit} className="space-y-3">
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
          <Button type="submit" disabled={commentPending}>
            {commentPending ? (
              <Loader2Icon className="size-4 animate-spin" aria-hidden />
            ) : (
              t("blog.posts.engagement.submitComment")
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
