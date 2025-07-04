import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";
import { category } from "~/features/schema";

export const bookmark = pgTable(
    "bookmark",
    {
      bookmark_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
      user_id: uuid()
          .references(() => authUsers.id, { onDelete: "cascade" }),
      category_id: bigint({ mode: "number" })
          .references(() => category.category_id, { onDelete: "cascade" }),
      title: varchar({ length: 255 }),
      url: text(),
      thumbnail_url: text(),
      is_favorite: boolean().notNull().default(false),
      created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
      updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
      // CREATE: 본인만 가능
      pgPolicy("create-bookmark-policy", {
          for: "insert",
          to: authenticatedRole,
          as: "permissive",
          withCheck: sql`${authUid} = ${table.user_id}`,
      }),
      // EDIT/DELETE: 본인만 가능
      pgPolicy("edit-bookmark-policy", {
        for: "update",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // DELETE: 본인만 가능
      pgPolicy("delete-bookmark-policy", {
        for: "delete",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
      // READ: 본인만 조회 가능
      pgPolicy("read-bookmark-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.user_id}`,
      }),
    ]
  );