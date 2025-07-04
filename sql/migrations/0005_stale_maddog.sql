ALTER TYPE "public"."ui_type_codes" ADD VALUE 'tab';--> statement-breakpoint
CREATE TABLE "ui_view_content" (
	"ui_view_id" bigint,
	"target_id" uuid,
	CONSTRAINT "ui_view_content_ui_view_id_target_id_pk" PRIMARY KEY("ui_view_id","target_id")
);
--> statement-breakpoint
ALTER TABLE "ui_view_content" ADD CONSTRAINT "ui_view_content_ui_view_id_ui_view_ui_view_id_fk" FOREIGN KEY ("ui_view_id") REFERENCES "public"."ui_view"("ui_view_id") ON DELETE cascade ON UPDATE no action;