/*
  Warnings:

  - Changed the type of `counting_mode` on the `training_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CountingMode" AS ENUM ('reps', 'time');

-- AlterTable
ALTER TABLE "training_items" DROP COLUMN "counting_mode",
ADD COLUMN     "counting_mode" "CountingMode" NOT NULL;
