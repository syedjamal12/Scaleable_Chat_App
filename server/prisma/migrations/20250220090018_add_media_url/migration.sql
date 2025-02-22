/*
  Warnings:

  - You are about to drop the column `image` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "image",
ADD COLUMN     "media_type" TEXT,
ADD COLUMN     "media_url" TEXT;
