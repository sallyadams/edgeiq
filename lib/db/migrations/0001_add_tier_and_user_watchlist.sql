ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tier" varchar DEFAULT 'free' NOT NULL;
--> statement-breakpoint
ALTER TABLE "watchlist" DROP CONSTRAINT IF EXISTS "watchlist_ticker_unique";
--> statement-breakpoint
ALTER TABLE "watchlist" DROP COLUMN IF EXISTS "alerts_enabled";
--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN IF NOT EXISTS "user_id" varchar;
--> statement-breakpoint
DELETE FROM "watchlist" WHERE "user_id" IS NULL OR "user_id" = '__placeholder__';
--> statement-breakpoint
ALTER TABLE "watchlist" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "watchlist" ALTER COLUMN "user_id" DROP DEFAULT;
--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "watchlist_user_ticker_idx" ON "watchlist" USING btree ("user_id", "ticker");
