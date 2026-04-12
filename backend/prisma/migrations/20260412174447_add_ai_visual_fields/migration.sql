-- AlterTable
ALTER TABLE `aianalysis` ADD COLUMN `featureJson` JSON NULL,
    ADD COLUMN `imageId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `top1Disease` VARCHAR(191) NULL,
    MODIFY `top2Disease` VARCHAR(191) NULL,
    MODIFY `top3Disease` VARCHAR(191) NULL,
    MODIFY `modelVersion` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `AIAnalysis_imageId_idx` ON `AIAnalysis`(`imageId`);

-- AddForeignKey
ALTER TABLE `AIAnalysis` ADD CONSTRAINT `AIAnalysis_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `MedicalImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
