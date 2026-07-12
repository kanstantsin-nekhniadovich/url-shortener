ALTER TABLE "url" RENAME COLUMN "originalUrl" TO "original_url";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "url" DROP CONSTRAINT "url_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "url" ADD CONSTRAINT "url_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;