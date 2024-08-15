-- CreateTable
CREATE TABLE `IncomeEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `sourceId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IncomeEntry` ADD CONSTRAINT `IncomeEntry_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
