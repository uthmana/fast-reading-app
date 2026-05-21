-- CreateTable
CREATE TABLE `WordExerciseTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wordId` INTEGER NOT NULL,
    `tag` ENUM('FASTREADING', 'UNDERSTANDING', 'FASTVISION') NOT NULL,

    UNIQUE INDEX `WordExerciseTag_wordId_tag_key`(`wordId`, `tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WordExerciseTag` ADD CONSTRAINT `WordExerciseTag_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Words`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
