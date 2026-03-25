CREATE TABLE "signals" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticker" text NOT NULL,
	"type" text NOT NULL,
	"action" text NOT NULL,
	"description" text NOT NULL,
	"conviction_score" real NOT NULL,
	"win_rate" real NOT NULL,
	"value_usd" real,
	"filer_name" text,
	"expiry_date" text,
	"strike_price" real,
	"option_type" text,
	"sentiment" text,
	"ai_insight" text,
	"source" text,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticker" text NOT NULL,
	"alerts_enabled" boolean DEFAULT true NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "watchlist_ticker_unique" UNIQUE("ticker")
);
--> statement-breakpoint
CREATE TABLE "oidc_state" (
	"state" varchar PRIMARY KEY NOT NULL,
	"code_verifier" varchar NOT NULL,
	"nonce" varchar NOT NULL,
	"return_to" varchar DEFAULT '/' NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");