ALTER TABLE "account" RENAME COLUMN "provider_account_id" TO "account_id";--> statement-breakpoint
DROP INDEX "account_issuer_providerAccountId_uidx";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "issuer" DROP NOT NULL;