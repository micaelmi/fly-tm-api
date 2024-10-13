/*
  Warnings:

  - You are about to alter the column `description` on the `clubs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `description` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `description` on the `movements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `how_it_works` on the `strategies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `description` on the `strategy_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `comments` on the `training_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "game_history" DROP CONSTRAINT "game_history_match_history_id_fkey";

-- DropForeignKey
ALTER TABLE "strategy_items" DROP CONSTRAINT "strategy_items_strategy_id_fkey";

-- DropForeignKey
ALTER TABLE "training_items" DROP CONSTRAINT "training_items_training_id_fkey";

-- AlterTable
ALTER TABLE "clubs" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "movements" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "strategies" ALTER COLUMN "how_it_works" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "strategy_items" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "training_items" ALTER COLUMN "comments" SET DATA TYPE VARCHAR(500);

-- AddForeignKey
ALTER TABLE "strategy_items" ADD CONSTRAINT "strategy_items_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_items" ADD CONSTRAINT "training_items_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_history" ADD CONSTRAINT "game_history_match_history_id_fkey" FOREIGN KEY ("match_history_id") REFERENCES "match_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
