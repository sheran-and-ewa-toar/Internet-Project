CREATE TABLE IF NOT EXISTS `User` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(10) NOT NULL,
  `lastName` VARCHAR(20) NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `userRole` VARCHAR(255) NOT NULL DEFAULT 'user',
  `theme` VARCHAR(255) NOT NULL DEFAULT 'light',
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `FeatureSet` (
  `featureSetId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortName` VARCHAR(255) NOT NULL,
  `featureCount` INT NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`featureSetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `FeatureFilter` (
  `filterId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortName` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`filterId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ModelType` (
  `modelTypeId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortName` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`modelTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MiRnaData` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mirbase_id` VARCHAR(255) NULL,
  `chromosome` VARCHAR(255) NULL,
  `start` INT NULL,
  `end` INT NULL,
  `strand` VARCHAR(1) NULL,
  `seed` VARCHAR(255) NULL,
  `mature_sequence` TEXT NULL,
  `star_sequence` TEXT NULL,
  `precursor` TEXT NULL,
  `mature_length` INT NULL,
  `isPositive` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Job` (
  `jobId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `featureSetId` INT NOT NULL,
  `modelTypeId` INT NOT NULL,
  `featureSetName` VARCHAR(255) NULL,
  `modelName` VARCHAR(255) NULL,
  `pearsonEnabled` TINYINT(1) NULL,
  `pearsonThreshold` FLOAT NULL,
  `varianceEnabled` TINYINT(1) NULL,
  `varianceThreshold` FLOAT NULL,
  `status` VARCHAR(255) NULL,
  `accuracy` FLOAT NULL,
  `precision` FLOAT NULL,
  `recall` FLOAT NULL,
  `f1Score` FLOAT NULL,
  `cv_mean` FLOAT NULL,
  `cv_std` FLOAT NULL,
  `featureCount` INT NULL,
  `error` TEXT NULL,
  `errorTrace` TEXT NULL,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- Relational Constraints & Mapping Keys
  CONSTRAINT `fk_job_user`
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
    ON UPDATE CASCADE ON DELETE CASCADE,
    
  CONSTRAINT `fk_job_feature_set`
    FOREIGN KEY (`featureSetId`) REFERENCES `FeatureSet` (`featureSetId`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
    
  CONSTRAINT `fk_job_model_type`
    FOREIGN KEY (`modelTypeId`) REFERENCES `ModelType` (`modelTypeId`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Many-to-Many Relationship Table to correctly resolve applied filters per Job
CREATE TABLE IF NOT EXISTS `JobFilter` (
  `jobId` INT NOT NULL,
  `filterId` INT NOT NULL,
  `thresholdValue` FLOAT NULL,
  PRIMARY KEY (`jobId`, `filterId`),
  
  CONSTRAINT `fk_jf_job`
    FOREIGN KEY (`jobId`) REFERENCES `Job` (`jobId`)
    ON UPDATE CASCADE ON DELETE CASCADE,
    
  CONSTRAINT `fk_jf_filter`
    FOREIGN KEY (`filterId`) REFERENCES `FeatureFilter` (`filterId`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;