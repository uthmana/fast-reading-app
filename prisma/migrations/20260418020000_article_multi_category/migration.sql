-- CreateTable: ArticleCategory junction table for many-to-many Article <-> Category
CREATE TABLE `ArticleCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `ArticleCategory_articleId_categoryId_key`(`articleId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `ArticleCategory` ADD CONSTRAINT `ArticleCategory_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ArticleCategory` ADD CONSTRAINT `ArticleCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing Article -> Category relationships into the junction table
INSERT INTO `ArticleCategory` (`articleId`, `categoryId`)
SELECT `id`, `categoryId` FROM `Article` WHERE `categoryId` IS NOT NULL;

-- Drop the old foreign key and column
ALTER TABLE `Article` DROP FOREIGN KEY `Article_categoryId_fkey`;
ALTER TABLE `Article` DROP COLUMN `categoryId`;
