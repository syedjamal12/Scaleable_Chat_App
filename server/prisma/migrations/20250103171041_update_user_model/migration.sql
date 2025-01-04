/*
  Warnings:

  - A unique constraint covering the columns `[provider,oauth_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_oauth_id_key" ON "users"("provider", "oauth_id");
