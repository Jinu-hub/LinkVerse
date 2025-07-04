ALTER TABLE "ui_view" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "ui_view" ADD CONSTRAINT "ui_view_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ui_type_unique_index" ON "ui_type" USING btree ("ui_type_code");