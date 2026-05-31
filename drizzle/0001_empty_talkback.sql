ALTER TABLE "url" ALTER COLUMN "originalUrl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "url" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;