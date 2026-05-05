/*
  Warnings:

  - You are about to drop the column `taken` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `LessonExercise` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `LessonExercise` table. All the data in the column will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pathName` to the `LessonExercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LessonExercise` DROP FOREIGN KEY `LessonExercise_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `LessonExercise` DROP FOREIGN KEY `LessonExercise_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `Progress` DROP FOREIGN KEY `Progress_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `Progress` DROP FOREIGN KEY `Progress_lessonExerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `Progress` DROP FOREIGN KEY `Progress_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `Progress` DROP FOREIGN KEY `Progress_studentId_fkey`;

-- DropIndex
DROP INDEX `LessonExercise_exerciseId_fkey` ON `LessonExercise`;

-- DropIndex
DROP INDEX `LessonExercise_lessonId_fkey` ON `LessonExercise`;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `subscriberId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `subscriberId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Exercise` DROP COLUMN `taken`,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `isLocked` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `studentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `LessonExercise` DROP COLUMN `exerciseId`,
    DROP COLUMN `order`,
    ADD COLUMN `config` JSON NULL,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `minDuration` INTEGER NOT NULL DEFAULT 180,
    ADD COLUMN `pathName` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    MODIFY `lessonId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Words` ADD COLUMN `subscriberId` INTEGER NULL;

-- DropTable
DROP TABLE `Progress`;

-- CreateTable
CREATE TABLE `Registration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `type` ENUM('FRANCHISE', 'TRIAL_CLASS', 'GENERAL_INFO') NOT NULL DEFAULT 'GENERAL_INFO',
    `studyGroup` VARCHAR(191) NULL,
    `companyInfo` TEXT NULL,
    `message` TEXT NULL,
    `isProcessed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Registration_email_key`(`email`),
    UNIQUE INDEX `Registration_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Article_title_key` ON `Article`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_title_key` ON `Category`(`title`);

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonExercise` ADD CONSTRAINT `LessonExercise_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
