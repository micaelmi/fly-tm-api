/*
  Warnings:

  - Added the required column `description` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trainings" ADD COLUMN     "description" VARCHAR(1000) NOT NULL;
