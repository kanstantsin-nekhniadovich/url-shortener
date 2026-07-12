CREATE INDEX "url_hash" ON "redirect_event" USING btree ("url_hash");--> statement-breakpoint
CREATE INDEX "visited_at" ON "redirect_event" USING btree ("visited_at");--> statement-breakpoint
CREATE INDEX "url_hash_visited_at" ON "redirect_event" USING btree ("url_hash","visited_at" DESC NULLS LAST);