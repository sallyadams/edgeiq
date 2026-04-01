CREATE TABLE "portfolios" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar NOT NULL,
  "balance" real DEFAULT 10000 NOT NULL,
  "initial_balance" real DEFAULT 10000 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portfolios_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "positions" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar NOT NULL,
  "ticker" text NOT NULL,
  "side" text NOT NULL,
  "quantity" integer NOT NULL,
  "entry_price" real NOT NULL,
  "current_price" real NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "opened_at" timestamp DEFAULT now() NOT NULL,
  "closed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "trades" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar NOT NULL,
  "ticker" text NOT NULL,
  "side" text NOT NULL,
  "quantity" integer NOT NULL,
  "price" real NOT NULL,
  "total" real NOT NULL,
  "position_id" integer,
  "executed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;
