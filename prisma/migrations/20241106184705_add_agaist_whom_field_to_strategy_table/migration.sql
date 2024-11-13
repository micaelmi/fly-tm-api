/*
  Warnings:

  - Added the required column `against_whom` to the `strategies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clubs" ALTER COLUMN "maps_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "against_whom" VARCHAR(500) NOT NULL;
