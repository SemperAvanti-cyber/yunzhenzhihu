-- CreateTable
CREATE TABLE `ExperimentRun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `createdById` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `datasetName` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'RUNNING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'DRAFT',
    `accuracy` DOUBLE NULL,
    `recall` DOUBLE NULL,
    `f1Score` DOUBLE NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExperimentRun` ADD CONSTRAINT `ExperimentRun_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ResearchProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperimentRun` ADD CONSTRAINT `ExperimentRun_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
