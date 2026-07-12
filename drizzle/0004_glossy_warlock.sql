CREATE TYPE "public"."device_type" AS ENUM('desktop', 'mobile', 'bot');--> statement-breakpoint
ALTER TABLE "url_tag" DROP CONSTRAINT "url_tag_url_hash_url_hash_fk";
--> statement-breakpoint
ALTER TABLE "url_tag" DROP CONSTRAINT "url_tag_tag_name_tag_name_fk";
--> statement-breakpoint
ALTER TABLE "redirect_event" ALTER COLUMN "url_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "redirect_event" ALTER COLUMN "device_type" SET DATA TYPE "public"."device_type" USING "device_type"::"public"."device_type";--> statement-breakpoint
ALTER TABLE "url" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "url_tag" ADD CONSTRAINT "url_tag_url_hash_url_hash_fk" FOREIGN KEY ("url_hash") REFERENCES "public"."url"("hash") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_tag" ADD CONSTRAINT "url_tag_tag_name_tag_name_fk" FOREIGN KEY ("tag_name") REFERENCES "public"."tag"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redirect_event" ADD CONSTRAINT "response_ms is non-negative" CHECK ("redirect_event"."response_ms" > 0);