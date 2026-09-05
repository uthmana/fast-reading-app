/*
  Warnings:

  - You are about to drop the column `studyGroup` on the `Article` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ArticleCategory` DROP FOREIGN KEY `ArticleCategory_articleId_fkey`;

-- AlterTable
ALTER TABLE `Article` DROP COLUMN `studyGroup`;

-- CreateTable
CREATE TABLE `ArticleStudyGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER NOT NULL,
    `group` ENUM('ILKOKUL_2_3', 'ILKOKUL_4', 'ORTAOKUL', 'LISE', 'UNIVERSITE', 'DOKTORA', 'GENEL', 'YETISKIN', 'DISLEKSI', 'TIP', 'IELTS', 'LGS_HAZIRLIK', 'TYT_AYT_HAZIRLIK', 'DEMO') NOT NULL,

    UNIQUE INDEX `ArticleStudyGroup_articleId_group_key`(`articleId`, `group`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArticleStudyGroup` ADD CONSTRAINT `ArticleStudyGroup_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticleCategory` ADD CONSTRAINT `ArticleCategory_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
