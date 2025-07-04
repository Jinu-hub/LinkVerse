import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  bigint,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";
import { contentType } from "~/features/schema";

export const memo = pgTable(
    "memo",
    {
      memo_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
      user_id: uuid().references(() => authUsers.id, { onDelete: "cascade" }),
      content_type_id: integer().references(() => contentType.content_type_id, { onDelete: "cascade" }),
      target_id: bigint({ mode: "number" }),
      summary: text(),
      content: text(),
      created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
      updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
      position: integer(),
      is_pinned: boolean().notNull().default(false),
    },
    (table) => [
      // CREATE: 본인만 가능
      pgPolicy("create-memo-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
      }),
      // EDIT: 본인만 가능
      pgPolicy("edit-memo-policy", {
        for: "update",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // DELETE: 본인만 가능
      pgPolicy("delete-memo-policy", {
        for: "delete",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // READ: 본인만 가능
      pgPolicy("read-memo-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
    ]
  );
  