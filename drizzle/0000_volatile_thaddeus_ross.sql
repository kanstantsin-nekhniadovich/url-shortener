CREATE TABLE "url" (
	"hash" varchar PRIMARY KEY NOT NULL,
	"originalUrl" varchar,
	"createdAt" timestamp,
	"userId" uuid
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"email" varchar
);
--> statement-breakpoint
ALTER TABLE "url" ADD CONSTRAINT "url_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;