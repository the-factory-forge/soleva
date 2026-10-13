CREATE TABLE "agent_key" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"token_hash" text NOT NULL UNIQUE,
	"encrypted_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "sign_in_method" text;--> statement-breakpoint
CREATE INDEX "agent_key_user_id_idx" ON "agent_key" ("user_id");--> statement-breakpoint
ALTER TABLE "agent_key" ADD CONSTRAINT "agent_key_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;