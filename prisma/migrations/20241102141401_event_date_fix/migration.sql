/*
  Warnings:

  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `hide_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `show_date` on the `events` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "date",
DROP COLUMN "hide_date",
DROP COLUMN "show_date",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
