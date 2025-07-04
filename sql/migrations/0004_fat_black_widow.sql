CREATE TABLE "bookmark" (
	"bookmark_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookmark_bookmark_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"category_id" bigint,
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
	"memo_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "memo_memo_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"content_type_id" integer,
	"target_id" bigint,
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
	"category_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"content_type_id" integer,
	"category_name" varchar(100) NOT NULL,
	"level" integer,
	"parent_category_id" bigint,
	"sort_order" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ui_view" (
	"ui_view_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ui_view_ui_view_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"ui_type_id" integer,
	"content_type_id" integer,
	"category_id" bigint,
	"sort_order" integer,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ui_view" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ui_view_content" (
	"ui_view_id" bigint,
	"target_id" bigint,
	CONSTRAINT "ui_view_content_ui_view_id_target_id_pk" PRIMARY KEY("ui_view_id","target_id")
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"user_activity_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_activity_user_activity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"content_type_id" integer,
	"target_id" bigint,
	"activity_type" "activity_type_codes" NOT NULL,
	"value" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_activity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "taggable" (
	"tag_id" bigint,
	"content_type_id" integer,
	"target_id" bigint,
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
ALTER TABLE "ui_view" ADD CONSTRAINT "ui_view_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ui_view_content" ADD CONSTRAINT "ui_view_content_ui_view_id_ui_view_ui_view_id_fk" FOREIGN KEY ("ui_view_id") REFERENCES "public"."ui_view"("ui_view_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggable" ADD CONSTRAINT "taggable_tag_id_tag_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggable" ADD CONSTRAINT "taggable_content_type_id_content_type_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_type"("content_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_activity_unique_index" ON "user_activity" USING btree ("user_id","content_type_id","target_id","activity_type");--> statement-breakpoint
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
CREATE POLICY "create-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "edit-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id") WITH CHECK ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "delete-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "read-ui-view-policy" ON "ui_view" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "ui_view"."user_id");--> statement-breakpoint
CREATE POLICY "create-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "edit-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id") WITH CHECK ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "delete-user-activity-policy-user" ON "user_activity" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id");--> statement-breakpoint
CREATE POLICY "delete-user-activity-policy-admin" ON "user_activity" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-user-activity-policy" ON "user_activity" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_activity"."user_id");