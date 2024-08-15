/*
  Warnings:

  - You are about to drop the column `sourceId` on the `incomeentry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `incomeentry` table. All the data in the column will be lost.
  - Added the required column `source` to the `IncomeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `incomeentry` DROP FOREIGN KEY `IncomeEntry_sourceId_fkey`;

-- AlterTable
ALTER TABLE `incomeentry` DROP COLUMN `sourceId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;
