import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,  
  timestamp,
  bigint,
  uuid,
  varchar,  
  integer,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";
import { contentType } from "~/features/schema";

export const tag = pgTable(
    "tag",
    {
      tag_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
      user_id: uuid().references(() => authUsers.id, { onDelete: "cascade" }),
      tag_name: varchar({ length: 30 }).notNull(),
      usage_count: integer().notNull().default(0),
      created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
      updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
      // 유저별 태그 이름 중복 방지
      uniqueIndex("user_tag_unique").on(table.user_id, table.tag_name),
      // CREATE: 본인만 가능
      pgPolicy("create-tag-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
      }),
      // EDIT: 본인만 가능
      pgPolicy("edit-tag-policy", {
        for: "update",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // DELETE: 본인만 가능
      pgPolicy("delete-tag-policy", {
        for: "delete",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // READ: 본인만 가능
      pgPolicy("read-tag-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
    ]
  );
  
  export const taggable = pgTable(
    "taggable",
    {
      tag_id: bigint({ mode: "number" })
          .references(() => tag.tag_id, { onDelete: "cascade" }),
      content_type_id: integer()
          .references(() => contentType.content_type_id, { onDelete: "cascade" }),
      target_id: bigint({ mode: "number" }), // 콘텐츠 ID (폴리모픽)
    },
    (table) => [
      primaryKey({ columns: [table.tag_id, table.content_type_id, table.target_id]
      // RLS정책은 Supabase 관리자 화면에서 직접 SQL로 작성
      /*
      EXISTS (
          SELECT 1
          FROM tag
          WHERE tag.tag_id = taggable.tag_id
          AND tag.user_id = auth.uid()
        )
      */
     })]
  );