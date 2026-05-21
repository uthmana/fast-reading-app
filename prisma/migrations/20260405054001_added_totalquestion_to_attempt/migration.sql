/*
  Warnings:

  - You are about to drop the `WordExerciseTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `WordExerciseTag` DROP FOREIGN KEY `WordExerciseTag_wordId_fkey`;

-- AlterTable
ALTER TABLE `Attempt` ADD COLUMN `totalquestion` INTEGER NULL;

-- DropTable
DROP TABLE `WordExerciseTag`;
