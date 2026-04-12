-- DropForeignKey
ALTER TABLE `researchtask` DROP FOREIGN KEY `ResearchTask_assigneeId_fkey`;

-- DropForeignKey
ALTER TABLE `researchtask` DROP FOREIGN KEY `ResearchTask_assignerId_fkey`;

-- DropForeignKey
ALTER TABLE `researchtask` DROP FOREIGN KEY `ResearchTask_projectId_fkey`;

-- DropIndex
DROP INDEX `ResearchTask_assigneeId_idx` ON `researchtask`;

-- DropIndex
DROP INDEX `ResearchTask_assignerId_fkey` ON `researchtask`;

-- DropIndex
DROP INDEX `ResearchTask_projectId_idx` ON `researchtask`;

-- DropIndex
DROP INDEX `ResearchTask_status_idx` ON `researchtask`;

-- AlterTable
ALTER TABLE `researchtask` ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `progress` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `type` VARCHAR(40) NOT NULL DEFAULT 'GENERAL',
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `assignerId` INTEGER NULL,
    MODIFY `assigneeId` INTEGER NULL,
    MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ResearchProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_assignerId_fkey` FOREIGN KEY (`assignerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
