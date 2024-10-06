/*
  Warnings:

  - You are about to drop the column `level` on the `events` table. All the data in the column will be lost.
  - Added the required column `level_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility_type_id` to the `strategies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility_type_id` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "level",
ADD COLUMN     "level_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "club_id" TEXT,
ADD COLUMN     "visibility_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "trainings" ADD COLUMN     "club_id" TEXT,
ADD COLUMN     "visibility_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "visibility_types" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "visibility_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_visibility_type_id_fkey" FOREIGN KEY ("visibility_type_id") REFERENCES "visibility_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_visibility_type_id_fkey" FOREIGN KEY ("visibility_type_id") REFERENCES "visibility_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
