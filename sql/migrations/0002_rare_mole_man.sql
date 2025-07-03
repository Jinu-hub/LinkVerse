CREATE TYPE "public"."activity_type_codes" AS ENUM('click', 'view', 'edit', 'delete', 'create', 'share', 'export', 'import');--> statement-breakpoint
CREATE TYPE "public"."content_type_codes" AS ENUM('all', 'bookmark', 'book', 'movie', 'travel');--> statement-breakpoint
CREATE TYPE "public"."ui_type_codes" AS ENUM('default', 'list', 'card', 'grid', 'timeline', 'table', 'calendar', 'map', 'chart', 'gallery');--> statement-breakpoint
CREATE TABLE "bookmark" (
	"bookmark_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"category_id" uuid,
	"title" varchar(255),
	"url" text,
	"thumbnail_url" text,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmark" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "memo" (
	"memo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"content_type_id" integer,
	"target_id" uuid,
	"summary" text,
	"content" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"position" integer,
	"is_pinned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "category" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"content_type_id" integer,
	"category_name" varchar(100) NOT NULL,
	"level" integer,
	"parent_category_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "content_type" (
	"content_type_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "content_type_content_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content_type_code" "content_type_codes" NOT NULL,
	"content_type_name" varchar(100) NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_type" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ui_type" (
	"ui_type_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ui_type_ui_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ui_type_code" "ui_type_codes" NOT NULL,
	"ui_type_name" varchar(100) NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ui_type" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ui_view" (
	"ui_view_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ui_view_ui_view_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"ui_type_id" integer,
	"content_type_id" integer,
	"sort_order" integer,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ui_view" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_activity" (
	"user_activity_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_activity_user_activity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"content_type_id" integer,
	"target_id" uuid,
	"activity_type" "activity_type_codes" NOT NULL,
	"value" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_activity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tag" (
	"tag_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tag_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"tag_name" varchar(100) NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tag" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "taggable" (
	"tag_id" bigint,
	"content_type_id" integer,
	"target_id" uuid,
	CONSTRAINT "taggable_tag_id_content_type_id_target_id_pk" PRIMARY KEY("tag_id","content_type_id","target_id")
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo" ADD CONSTRAINT "memo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo" ADD CONSTRAINT "memo_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ui_view" ADD CONSTRAINT "ui_view_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ui_view" ADD CONSTRAINT "ui_view_ui_type_id_ui_type_ui_type_id_fk" FOREIGN KEY ("ui_type_id") REFERENCES "public"."ui_type"("ui_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ui_view" ADD CONSTRAINT "ui_view_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggable" ADD CONSTRAINT "taggable_tag_id_tag_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggable" ADD CONSTRAINT "taggable_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_tag_unique" ON "tag" USING btree ("user_id","tag_name");--> statement-breakpoint
CREATE POLICY "create-bookmark-policy" ON "bookmark" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "bookmark"."user_id");--> statement-breakpoint
CREATE POLICY "edit-bookmark-policy" ON "bookmark" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "bookmark"."user_id") WITH CHECK ((select auth.uid()) = "bookmark"."user_id");--> statement-breakpoint
CREATE POLICY "delete-bookmark-policy" ON "bookmark" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "bookmark"."user_id");--> statement-breakpoint
CREATE POLICY "read-bookmark-policy" ON "bookmark" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "bookmark"."user_id");--> statement-breakpoint
CREATE POLICY "create-memo-policy" ON "memo" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "memo"."user_id");--> statement-breakpoint
CREATE POLICY "edit-memo-policy" ON "memo" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "memo"."user_id") WITH CHECK ((select auth.uid()) = "memo"."user_id");--> statement-breakpoint
CREATE POLICY "delete-memo-policy" ON "memo" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "memo"."user_id");--> statement-breakpoint
CREATE POLICY "read-memo-policy" ON "memo" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "memo"."user_id");--> statement-breakpoint
CREATE POLICY "create-category-policy-user" ON "category" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "category"."user_id");--> statement-breakpoint
CREATE POLICY "create-category-policy-admin" ON "category" AS PERMISSIVE FOR INSERT TO "service_role";--> statement-breakpoint
CREATE POLICY "edit-category-policy" ON "category" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "category"."user_id") WITH CHECK ((select auth.uid()) = "category"."user_id");--> statement-breakpoint
CREATE POLICY "delete-category-policy" ON "category" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "category"."user_id");--> statement-breakpoint
CREATE POLICY "read-category-policy" ON "category" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "category"."user_id");--> statement-breakpoint
CREATE POLICY "create-content-type-policy" ON "content_type" AS PERMISSIVE FOR INSERT TO "service_role";--> statement-breakpoint
CREATE POLICY "edit-content-type-policy" ON "content_type" AS PERMISSIVE FOR UPDATE TO "service_role";--> statement-breakpoint
CREATE POLICY "delete-content-type-policy" ON "content_type" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-content-type-policy" ON "content_type" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "create-content-type-policy" ON "ui_type" AS PERMISSIVE FOR INSERT TO "service_role";--> statement-breakpoint
CREATE POLICY "edit-content-type-policy" ON "ui_type" AS PERMISSIVE FOR UPDATE TO "service_role";--> statement-breakpoint
CREATE POLICY "delete-content-type-policy" ON "ui_type" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-content-type-policy" ON "ui_type" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "create-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "edit-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id") WITH CHECK ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "delete-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "read-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "create-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "edit-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id") WITH CHECK ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "delete-user-activity-policy-user" ON "user_activity" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "delete-user-activity-policy-admin" ON "user_activity" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "create-tag-policy" ON "tag" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "tag"."user_id");--> statement-breakpoint
CREATE POLICY "edit-tag-policy" ON "tag" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "tag"."user_id") WITH CHECK ((select auth.uid()) = "tag"."user_id");--> statement-breakpoint
CREATE POLICY "delete-tag-policy" ON "tag" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "tag"."user_id");--> statement-breakpoint
CREATE POLICY "read-tag-policy" ON "tag" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "tag"."user_id");