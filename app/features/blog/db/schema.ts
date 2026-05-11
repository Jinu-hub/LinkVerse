import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  foreignKey,
  index,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  anonRole,
  authUid,
  authUsers,
  authenticatedRole,
  serviceRole,
} from "drizzle-orm/supabase";

/**
 * 블로그 글 좋아요 (논리 글당 1행 + like_count)
 *
 * MDX 의 translationKey 에 대응하는 post_key 로 식별해, 언어 전환 후에도 동일 숫자를 공유한다.
 * translationKey 가 비어 있는 글은 로더 단계에서 고유 문자열 폴백을 넣는 전제이다.
 * user_id 없음. 클라 직접 카운트 조작 방지용으로 INSERT/UPDATE/DELETE 는 service_role 만 허용.
 * +1 은 서버(쿠키 세션·Redis TTL 등 게이트 후 upsert)에서 처리한다.
 */
export const blogPostLike = pgTable(
  "blog_post_like",
  {
    blog_post_like_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    post_key: varchar({ length: 160 }).notNull(),
    like_count: bigint({ mode: "number" }).notNull().default(0),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("blog_post_like_post_key_unique").on(table.post_key),
    pgPolicy("create-blog-post-like-policy-admin", {
      for: "insert",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("update-blog-post-like-policy-admin", {
      for: "update",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("delete-blog-post-like-policy-admin", {
      for: "delete",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("read-blog-post-like-policy-auth", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("read-blog-post-like-policy-anon", {
      for: "select",
      to: anonRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

/**
 * 블로그 글 좋아요 — 로그인 유저별 1행 (post_key + user_id)
 *
 * blog_post_like 집계와 별도로 “누가 눌렀는지”만 기록한다. 익명 좋아요는 이 테이블에 넣지 않는다.
 * post_key 는 blog_post_like 와 FK 로 맞춰 orphan 행을 막는다.
 */
export const blogPostLikeUser = pgTable(
  "blog_post_like_user",
  {
    post_key: varchar({ length: 160 })
      .notNull()
      .references(() => blogPostLike.post_key, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.post_key, table.user_id] }),
    index("blog_post_like_user_user_id_idx").on(table.user_id),
    pgPolicy("create-blog-post-like-user-policy-admin", {
      for: "insert",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("create-blog-post-like-user-policy-auth", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("update-blog-post-like-user-policy-admin", {
      for: "update",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("delete-blog-post-like-user-policy-admin", {
      for: "delete",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("delete-blog-post-like-user-policy-auth", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("read-blog-post-like-user-policy-auth", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
  ],
);

/**
 * 블로그 글 댓글
 *
 * 대상 글은 blog_post_like 와 동일하게 post_key(MDX translationKey 대응)로만 가리켜 모든 언어에서 같은 스레드를 본다.
 * 계층은 parent_comment_id 로 표현한다.
 * 로그인 댓글: user_id 설정·guest_name null / 익명: user_id null·guest_name 필수.
 * 익명 행은 본인 수정·삭제 RLS 가 없으므로 필요 시 service role 등으로 조정한다.
 */
export const blogComment = pgTable(
  "blog_comment",
  {
    blog_comment_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid().references(() => authUsers.id, { onDelete: "cascade" }),
    guest_name: varchar({ length: 120 }),
    post_key: varchar({ length: 160 }).notNull(),
    body: text().notNull(),
    parent_comment_id: bigint({ mode: "number" }),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parent_comment_id],
      foreignColumns: [table.blog_comment_id],
      name: "blog_comment_parent_comment_id_blog_comment_blog_comment_id_fk",
    }).onDelete("cascade"),
    check(
      "blog_comment_author_check",
      sql`(${table.user_id} IS NOT NULL AND ${table.guest_name} IS NULL) OR (${table.user_id} IS NULL AND coalesce(trim(${table.guest_name}), '') <> '')`,
    ),
    index("blog_comment_post_key_idx").on(table.post_key),
    pgPolicy("create-blog-comment-policy-auth", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id} AND ${table.user_id} IS NOT NULL AND ${table.guest_name} IS NULL`,
    }),
    pgPolicy("create-blog-comment-policy-anon", {
      for: "insert",
      to: anonRole,
      as: "permissive",
      withCheck: sql`${table.user_id} IS NULL AND coalesce(trim(${table.guest_name}), '') <> ''`,
    }),
    pgPolicy("edit-blog-comment-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
      using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("delete-blog-comment-policy-user", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("delete-blog-comment-policy-admin", {
      for: "delete",
      to: serviceRole,
      as: "permissive",
    }),
    pgPolicy("read-blog-comment-policy-auth", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("read-blog-comment-policy-anon", {
      for: "select",
      to: anonRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
