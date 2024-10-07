/*
  Warnings:

  - You are about to alter the column `description` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `answer` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "answer" SET DATA TYPE VARCHAR(1000);
