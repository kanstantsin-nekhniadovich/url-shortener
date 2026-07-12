CREATE TABLE "redirect_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url_hash" varchar,
	"visited_at" timestamp DEFAULT now() NOT NULL,
	"visitor_country" varchar(2) NOT NULL,
	"referer_host" varchar,
	"device_type" varchar(16) NOT NULL,
	"response_ms" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"name" varchar PRIMARY KEY NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "url_tag" (
	"url_hash" varchar NOT NULL,
	"tag_name" varchar NOT NULL,
	CONSTRAINT "url_tag_url_hash_tag_name_pk" PRIMARY KEY("url_hash","tag_name")
);
--> statement-breakpoint
ALTER TABLE "redirect_event" ADD CONSTRAINT "redirect_event_url_hash_url_hash_fk" FOREIGN KEY ("url_hash") REFERENCES "public"."url"("hash") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_tag" ADD CONSTRAINT "url_tag_url_hash_url_hash_fk" FOREIGN KEY ("url_hash") REFERENCES "public"."url"("hash") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_tag" ADD CONSTRAINT "url_tag_tag_name_tag_name_fk" FOREIGN KEY ("tag_name") REFERENCES "public"."tag"("name") ON DELETE no action ON UPDATE no action;