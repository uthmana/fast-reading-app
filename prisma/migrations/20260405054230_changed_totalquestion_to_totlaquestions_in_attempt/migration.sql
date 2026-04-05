/*
  Warnings:

  - You are about to drop the column `totalquestion` on the `Attempt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Attempt` DROP COLUMN `totalquestion`,
    ADD COLUMN `totalquestions` INTEGER NULL;
