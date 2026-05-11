CREATE TABLE "blog_comment" (
	"blog_comment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_comment_blog_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"guest_name" varchar(120),
	"post_key" varchar(160) NOT NULL,
	"body" text NOT NULL,
	"parent_comment_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_comment_author_check" CHECK (("blog_comment"."user_id" IS NOT NULL AND "blog_comment"."guest_name" IS NULL) OR ("blog_comment"."user_id" IS NULL AND coalesce(trim("blog_comment"."guest_name"), '') <> ''))
);
--> statement-breakpoint
ALTER TABLE "blog_comment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "blog_post_like" (
	"blog_post_like_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_post_like_blog_post_like_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"post_key" varchar(160) NOT NULL,
	"like_count" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_post_like" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_post_like_post_key_unique" ON "blog_post_like" USING btree ("post_key");--> statement-breakpoint
CREATE TABLE "blog_post_like_user" (
	"post_key" varchar(160) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_post_like_user_post_key_user_id_pk" PRIMARY KEY("post_key","user_id")
);
--> statement-breakpoint
ALTER TABLE "blog_post_like_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_parent_comment_id_blog_comment_blog_comment_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."blog_comment"("blog_comment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_like_user" ADD CONSTRAINT "blog_post_like_user_post_key_blog_post_like_post_key_fk" FOREIGN KEY ("post_key") REFERENCES "public"."blog_post_like"("post_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_like_user" ADD CONSTRAINT "blog_post_like_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_comment_post_key_idx" ON "blog_comment" USING btree ("post_key");--> statement-breakpoint
CREATE INDEX "blog_post_like_user_user_id_idx" ON "blog_post_like_user" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "create-blog-comment-policy-auth" ON "blog_comment" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "blog_comment"."user_id" AND "blog_comment"."user_id" IS NOT NULL AND "blog_comment"."guest_name" IS NULL);--> statement-breakpoint
CREATE POLICY "create-blog-comment-policy-anon" ON "blog_comment" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK ("blog_comment"."user_id" IS NULL AND coalesce(trim("blog_comment"."guest_name"), '') <> '');--> statement-breakpoint
CREATE POLICY "edit-blog-comment-policy" ON "blog_comment" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "blog_comment"."user_id") WITH CHECK ((select auth.uid()) = "blog_comment"."user_id");--> statement-breakpoint
CREATE POLICY "delete-blog-comment-policy-user" ON "blog_comment" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "blog_comment"."user_id");--> statement-breakpoint
CREATE POLICY "delete-blog-comment-policy-admin" ON "blog_comment" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-blog-comment-policy-auth" ON "blog_comment" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "read-blog-comment-policy-anon" ON "blog_comment" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "create-blog-post-like-policy-admin" ON "blog_post_like" AS PERMISSIVE FOR INSERT TO "service_role";--> statement-breakpoint
CREATE POLICY "update-blog-post-like-policy-admin" ON "blog_post_like" AS PERMISSIVE FOR UPDATE TO "service_role";--> statement-breakpoint
CREATE POLICY "delete-blog-post-like-policy-admin" ON "blog_post_like" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "read-blog-post-like-policy-auth" ON "blog_post_like" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "read-blog-post-like-policy-anon" ON "blog_post_like" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "create-blog-post-like-user-policy-admin" ON "blog_post_like_user" AS PERMISSIVE FOR INSERT TO "service_role";--> statement-breakpoint
CREATE POLICY "create-blog-post-like-user-policy-auth" ON "blog_post_like_user" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "blog_post_like_user"."user_id");--> statement-breakpoint
CREATE POLICY "update-blog-post-like-user-policy-admin" ON "blog_post_like_user" AS PERMISSIVE FOR UPDATE TO "service_role";--> statement-breakpoint
CREATE POLICY "delete-blog-post-like-user-policy-admin" ON "blog_post_like_user" AS PERMISSIVE FOR DELETE TO "service_role";--> statement-breakpoint
CREATE POLICY "delete-blog-post-like-user-policy-auth" ON "blog_post_like_user" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "blog_post_like_user"."user_id");--> statement-breakpoint
CREATE POLICY "read-blog-post-like-user-policy-auth" ON "blog_post_like_user" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "blog_post_like_user"."user_id");