ALTER TABLE "category" ADD COLUMN "sort_order" integer;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_activity_unique_index" ON "user_activity" USING btree ("user_id","content_type_id","target_id","activity_type");