import { sql } from "drizzle-orm";
import {
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  bigint,
  uuid,
  pgEnum,
  varchar,
  boolean,
  integer,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { CONTENT_TYPES, UI_TYPES, ACTIVITY_TYPES } from "../core/lib/constants";

export const contentTypeCodes = pgEnum(
    "content_type_codes",
    CONTENT_TYPES.map((type) => type.code) as [string, ...string[]]
  );

export const uiTypeCodes = pgEnum(
    "ui_type_codes",
    UI_TYPES.map((type) => type.code) as [string, ...string[]]
  );

export const activityTypeCodes = pgEnum(
    "activity_type_codes",
    ACTIVITY_TYPES.map((type) => type.code) as [string, ...string[]]
  );

export const contentType = pgTable("content_type", 
  {
    content_type_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    content_type_code: contentTypeCodes().notNull(),
    content_type_name: varchar({ length: 100 }).notNull(),
    description: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // CREATE: 관리자만 가능
    pgPolicy("create-content-type-policy", {
        for: "insert",
        to: serviceRole,
        as: "permissive",
    }),
    // EDIT: 관리자만 가능
    pgPolicy("edit-content-type-policy", {
        for: "update",
        to: serviceRole,
        as: "permissive",
    }),
    // DELETE: 관리자만 가능
    pgPolicy("delete-content-type-policy", {
        for: "delete",
        to: serviceRole,
        as: "permissive",
    }),
    // READ: 인증된 사용자, 혹은 관리자
    pgPolicy("read-content-type-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
    }),
  ]
);

export const uiType = pgTable("ui_type", 
  {
      ui_type_id: integer().primaryKey().generatedAlwaysAsIdentity(),
      ui_type_code: uiTypeCodes().notNull(),
      ui_type_name: varchar({ length: 100 }).notNull(),
      description: text(),
      createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // CREATE: 관리자만 가능
    pgPolicy("create-content-type-policy", {
        for: "insert",
        to: serviceRole,
        as: "permissive",
    }),
    // EDIT: 관리자만 가능
    pgPolicy("edit-content-type-policy", {
        for: "update",
        to: serviceRole,
        as: "permissive",
    }),
    // DELETE: 관리자만 가능
    pgPolicy("delete-content-type-policy", {
        for: "delete",
        to: serviceRole,
        as: "permissive",
    }),
    // READ: 인증된 사용자, 혹은 관리자
    pgPolicy("read-content-type-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
    }),
  ]
);

export const category = pgTable(
"category",
{
    category_id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    content_type_id: integer()
      .references(() => contentType.content_type_id, { onDelete: "cascade" }),
    category_name: varchar({ length: 100 }).notNull(),
    level: integer(),
    parent_category_id: uuid(),
    sort_order: integer(),
    is_default: boolean().notNull().default(false),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
},
(table) => [
    // CREATE: 인증된 사용자, 혹은 관리자
    // 인증된 사용자(본인)에게 허용
    pgPolicy("create-category-policy-user", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.user_id}`,
    }),
    // 관리자에게 허용
    pgPolicy("create-category-policy-admin", {
        for: "insert",
        to: serviceRole,
        as: "permissive",
        // 관리자라면 본인 user_id가 아니어도 허용
    }),
    // EDIT/DELETE: 본인만 가능
    pgPolicy("edit-category-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.user_id}`,
    using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("delete-category-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.user_id}`,
    }),
    // READ: 본인만 조회 가능
    pgPolicy("read-category-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.user_id}`,
    }),
]
);

export const uiView = pgTable(
  "ui_view",
  {
    ui_view_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    ui_type_id: integer()
        .references(() => uiType.ui_type_id, { onDelete: "cascade" }),
    content_type_id: integer()
        .references(() => contentType.content_type_id, { onDelete: "cascade" }),
    sort_order: integer(),
    name: varchar({ length: 100 }).notNull(),
    is_active: boolean().notNull().default(true),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // CREATE: 본인만 가능
    pgPolicy("create-ui-view-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
    }),
    // EDIT: 본인만 가능
    pgPolicy("edit-ui-view-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
      using: sql`${authUid} = ${table.user_id}`,
    }),
    // DELETE: 본인만 가능
    pgPolicy("delete-ui-view-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    // READ: 본인만 조회 가능
    pgPolicy("read-ui-view-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
  ]
);

export const uiViewContent = pgTable(
  "ui_view_content",
  {
    ui_view_id: bigint({ mode: "number" })
        .references(() => uiView.ui_view_id, { onDelete: "cascade" }),
    target_id: uuid(),
  },
  (table) => [
    primaryKey({ columns: [table.ui_view_id, table.target_id] }),
      // RLS정책은 Supabase 관리자 화면에서 직접 SQL로 작성
      /*
      EXISTS (
          SELECT 1
          FROM ui_view
          WHERE ui_view.ui_view_id = ui_view_content.ui_view_id
          AND ui_view.user_id = auth.uid()
        )
      */
  ]
);

export const userActivity = pgTable(
  "user_activity",
  {
    user_activity_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    content_type_id: integer()
        .references(() => contentType.content_type_id, { onDelete: "cascade" }),
    target_id: uuid(),
    activity_type: activityTypeCodes().notNull(),
    value: integer(),
    metadata: jsonb(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    last_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_activity_unique_index").on(table.user_id, table.content_type_id, table.target_id, table.activity_type),
    // CREATE: 본인만 가능
    pgPolicy("create-user-activity-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
    }),
    // EDIT: 본인만 가능
    pgPolicy("edit-user-activity-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
      using: sql`${authUid} = ${table.user_id}`,
    }),
    // DELETE: 인증된 사용자, 혹은 관리자
    pgPolicy("delete-user-activity-policy-user", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("delete-user-activity-policy-admin", {
      for: "delete",
      to: serviceRole,
      as: "permissive",
    }),
    // READ: 본인만 조회 가능
    pgPolicy("read-user-activity-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
  ]
);

