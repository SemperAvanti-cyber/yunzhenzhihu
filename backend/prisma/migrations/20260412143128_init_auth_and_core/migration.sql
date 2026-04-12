-- CreateTable
CREATE TABLE `Hospital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `level` VARCHAR(40) NULL,
    `address` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Hospital_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `hospitalId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_code_key`(`code`),
    INDEX `Department_hospitalId_idx`(`hospitalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(80) NOT NULL,
    `email` VARCHAR(120) NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `realName` VARCHAR(80) NOT NULL,
    `role` ENUM('DOCTOR', 'HOSPITAL_ADMIN', 'RESEARCH_ADMIN', 'SECURITY_ADMIN') NOT NULL,
    `title` VARCHAR(80) NULL,
    `phone` VARCHAR(30) NULL,
    `hospitalId` INTEGER NOT NULL,
    `departmentId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `hasResearchAccess` BOOLEAN NOT NULL DEFAULT false,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_hospitalId_idx`(`hospitalId`),
    INDEX `User_departmentId_idx`(`departmentId`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientCode` VARCHAR(40) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `gender` VARCHAR(20) NULL,
    `age` INTEGER NULL,
    `phone` VARCHAR(30) NULL,
    `identityNo` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patient_patientCode_key`(`patientCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalCase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caseCode` VARCHAR(50) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `chiefComplaint` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'IN_TREATMENT', 'REFERRED', 'CLOSED') NOT NULL,
    `riskLevel` INTEGER NULL,
    `finalConclusion` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MedicalCase_caseCode_key`(`caseCode`),
    INDEX `MedicalCase_patientId_idx`(`patientId`),
    INDEX `MedicalCase_doctorId_idx`(`doctorId`),
    INDEX `MedicalCase_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageCode` VARCHAR(50) NOT NULL,
    `caseId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `type` ENUM('CLINICAL_PHOTO', 'DERMOSCOPY', 'PATHOLOGY', 'FOLLOW_UP') NOT NULL,
    `bodyPart` VARCHAR(80) NULL,
    `capturedAt` DATETIME(3) NULL,
    `capturedBy` VARCHAR(80) NULL,
    `deviceName` VARCHAR(80) NULL,
    `accessLevel` ENUM('CLINICAL_RAW', 'CONSULT_COPY', 'RESEARCH_ANON') NOT NULL,
    `isQcPassed` BOOLEAN NOT NULL DEFAULT true,
    `qcNote` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MedicalImage_imageCode_key`(`imageCode`),
    INDEX `MedicalImage_caseId_idx`(`caseId`),
    INDEX `MedicalImage_accessLevel_idx`(`accessLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIAnalysis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caseId` INTEGER NOT NULL,
    `malignancyProb` DOUBLE NOT NULL,
    `top1Disease` VARCHAR(80) NULL,
    `top1Prob` DOUBLE NULL,
    `top2Disease` VARCHAR(80) NULL,
    `top2Prob` DOUBLE NULL,
    `top3Disease` VARCHAR(80) NULL,
    `top3Prob` DOUBLE NULL,
    `modelVersion` VARCHAR(80) NULL,
    `heatmapUrl` VARCHAR(255) NULL,
    `bboxJson` JSON NULL,
    `summary` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AIAnalysis_caseId_idx`(`caseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnosis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caseId` INTEGER NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `conclusion` TEXT NOT NULL,
    `treatmentPlan` TEXT NULL,
    `suggestion` TEXT NULL,
    `isFinal` BOOLEAN NOT NULL DEFAULT false,
    `reviewComment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Diagnosis_caseId_idx`(`caseId`),
    INDEX `Diagnosis_doctorId_idx`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referralCode` VARCHAR(50) NOT NULL,
    `caseId` INTEGER NOT NULL,
    `fromHospitalId` INTEGER NOT NULL,
    `toHospitalId` INTEGER NOT NULL,
    `type` ENUM('INTERNAL_CONSULTATION', 'REFERRAL', 'REMOTE_CONSULTATION') NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED', 'COMPLETED') NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Referral_referralCode_key`(`referralCode`),
    INDEX `Referral_caseId_idx`(`caseId`),
    INDEX `Referral_fromHospitalId_idx`(`fromHospitalId`),
    INDEX `Referral_toHospitalId_idx`(`toHospitalId`),
    INDEX `Referral_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectCode` VARCHAR(50) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `level` VARCHAR(60) NULL,
    `principalInvestigator` VARCHAR(80) NOT NULL,
    `ethicsCode` VARCHAR(80) NULL,
    `ethicsExpireAt` DATETIME(3) NULL,
    `dataScope` TEXT NULL,
    `status` ENUM('ACTIVE', 'DELAYED', 'COMPLETED') NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ResearchProject_projectCode_key`(`projectCode`),
    INDEX `ResearchProject_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `role` ENUM('PI', 'MEMBER', 'COLLABORATOR') NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectMember_userId_idx`(`userId`),
    UNIQUE INDEX `ProjectMember_projectId_userId_key`(`projectId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchTask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(160) NOT NULL,
    `description` TEXT NULL,
    `projectId` INTEGER NOT NULL,
    `assignerId` INTEGER NOT NULL,
    `assigneeId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'DONE') NOT NULL,
    `dueAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ResearchTask_projectId_idx`(`projectId`),
    INDEX `ResearchTask_assigneeId_idx`(`assigneeId`),
    INDEX `ResearchTask_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `approvalCode` VARCHAR(50) NOT NULL,
    `type` ENUM('PROJECT_REGISTRATION', 'EXPORT_REQUEST', 'CONSULTATION_REQUEST', 'ROLE_CHANGE') NOT NULL,
    `targetType` VARCHAR(80) NOT NULL,
    `targetId` VARCHAR(80) NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `reviewerId` INTEGER NULL,
    `projectId` INTEGER NULL,
    `status` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'RETURNED', 'REJECTED') NOT NULL,
    `reason` TEXT NULL,
    `snapshotJson` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ApprovalRecord_approvalCode_key`(`approvalCode`),
    INDEX `ApprovalRecord_status_idx`(`status`),
    INDEX `ApprovalRecord_type_idx`(`type`),
    INDEX `ApprovalRecord_applicantId_idx`(`applicantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecurityAlert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alertCode` VARCHAR(50) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `source` VARCHAR(100) NULL,
    `level` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'IGNORED') NOT NULL,
    `targetType` VARCHAR(80) NULL,
    `targetId` VARCHAR(80) NULL,
    `detail` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SecurityAlert_alertCode_key`(`alertCode`),
    INDEX `SecurityAlert_level_idx`(`level`),
    INDEX `SecurityAlert_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BackupRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backupCode` VARCHAR(50) NOT NULL,
    `type` ENUM('AUTO', 'MANUAL', 'RESTORE_POINT') NOT NULL,
    `status` ENUM('PENDING', 'RUNNING', 'SUCCESS', 'FAILED') NOT NULL,
    `storagePath` VARCHAR(255) NULL,
    `sizeMb` DOUBLE NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NULL,

    UNIQUE INDEX `BackupRecord_backupCode_key`(`backupCode`),
    INDEX `BackupRecord_status_idx`(`status`),
    INDEX `BackupRecord_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `username` VARCHAR(80) NOT NULL,
    `roleAttempt` VARCHAR(40) NULL,
    `ipAddress` VARCHAR(64) NULL,
    `userAgent` VARCHAR(255) NULL,
    `result` ENUM('SUCCESS', 'FAILED', 'LOCKED') NOT NULL,
    `reason` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginLog_username_idx`(`username`),
    INDEX `LoginLog_result_idx`(`result`),
    INDEX `LoginLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `actorName` VARCHAR(80) NOT NULL,
    `actorRole` VARCHAR(40) NOT NULL,
    `actionType` VARCHAR(80) NOT NULL,
    `targetType` VARCHAR(80) NOT NULL,
    `targetId` VARCHAR(80) NOT NULL,
    `detail` TEXT NULL,
    `ipAddress` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_actionType_idx`(`actionType`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalCase` ADD CONSTRAINT `MedicalCase_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalCase` ADD CONSTRAINT `MedicalCase_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalImage` ADD CONSTRAINT `MedicalImage_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `MedicalCase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIAnalysis` ADD CONSTRAINT `AIAnalysis_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `MedicalCase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `MedicalCase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `MedicalCase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_fromHospitalId_fkey` FOREIGN KEY (`fromHospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_toHospitalId_fkey` FOREIGN KEY (`toHospitalId`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMember` ADD CONSTRAINT `ProjectMember_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ResearchProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMember` ADD CONSTRAINT `ProjectMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ResearchProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_assignerId_fkey` FOREIGN KEY (`assignerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchTask` ADD CONSTRAINT `ResearchTask_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRecord` ADD CONSTRAINT `ApprovalRecord_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRecord` ADD CONSTRAINT `ApprovalRecord_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRecord` ADD CONSTRAINT `ApprovalRecord_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ResearchProject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginLog` ADD CONSTRAINT `LoginLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
