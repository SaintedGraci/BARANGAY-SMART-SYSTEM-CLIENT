-- ============================================
-- BARANGAY BAKILID SYSTEM - DATABASE SCHEMA
-- ============================================
-- Database: barangay_system
-- Version: 1.0.0
-- Last Updated: June 8, 2026
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS barangay_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE barangay_system;

-- ============================================
-- TABLE 1: USERS
-- Description: Core user authentication table
-- ============================================
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) DEFAULT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `contactNumber` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('resident', 'staff', 'secretary', 'captain', 'admin') NOT NULL DEFAULT 'resident',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_username` (`username`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`),
  INDEX `idx_isVerified` (`isVerified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 2: RESIDENTS
-- Description: Resident profile information
-- ============================================
CREATE TABLE IF NOT EXISTS `Residents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `firstName` VARCHAR(255) NOT NULL,
  `middleName` VARCHAR(255) DEFAULT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `gender` ENUM('Male', 'Female') DEFAULT NULL,
  `birthDate` DATE DEFAULT NULL,
  `contactNumber` VARCHAR(255) DEFAULT NULL,
  `purok` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `citizenship` VARCHAR(255) DEFAULT 'Filipino',
  `validIdPath` VARCHAR(255) DEFAULT NULL,
  `proofOfResidencyPath` VARCHAR(255) DEFAULT NULL,
  `verificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `fk_resident_user` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_verification_status` (`verificationStatus`),
  INDEX `idx_full_name` (`firstName`, `lastName`),
  INDEX `idx_purok` (`purok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 3: REQUESTS
-- Description: Document requests from residents
-- ============================================
CREATE TABLE IF NOT EXISTS `Requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ResidentId` INT NOT NULL,
  `documentType` ENUM(
    'Barangay Clearance',
    'Certificate of Residency',
    'Indigency Certificate',
    'Business Permit',
    'Certificate of Good Moral',
    'Community Tax Certificate (Cedula)'
  ) NOT NULL,
  `purpose` VARCHAR(255) NOT NULL,
  `status` ENUM('Pending', 'Processing', 'Ready for Release', 'Claimed', 'Rejected') NOT NULL DEFAULT 'Pending',
  `remarks` TEXT DEFAULT NULL,
  `releaseDate` DATE DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_request_resident` FOREIGN KEY (`ResidentId`) REFERENCES `Residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_status` (`status`),
  INDEX `idx_document_type` (`documentType`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 4: COMPLAINTS
-- Description: Complaints filed by residents
-- ============================================
CREATE TABLE IF NOT EXISTS `Complaints` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ResidentId` INT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('Pending', 'Investigating', 'Resolved') NOT NULL DEFAULT 'Pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_complaint_resident` FOREIGN KEY (`ResidentId`) REFERENCES `Residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 5: OFFICIALS
-- Description: Barangay officials information
-- ============================================
CREATE TABLE IF NOT EXISTS `Officials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NOT NULL,
  `middleName` VARCHAR(255) DEFAULT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `position` ENUM(
    'Barangay Captain',
    'Barangay Kagawad',
    'SK Chairman',
    'Barangay Secretary',
    'Barangay Treasurer'
  ) NOT NULL,
  `contactNumber` VARCHAR(255) DEFAULT NULL,
  `termStart` DATE DEFAULT NULL,
  `termEnd` DATE DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_position` (`position`),
  INDEX `idx_is_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 6: ANNOUNCEMENTS
-- Description: Barangay announcements
-- ============================================
CREATE TABLE IF NOT EXISTS `Announcements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Archived') NOT NULL DEFAULT 'Active',
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  `expiryDate` DATE DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 7: NOTIFICATIONS
-- Description: User notifications
-- ============================================
CREATE TABLE IF NOT EXISTS `Notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL DEFAULT 'request_status_update',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `data` JSON DEFAULT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_user_read` (`UserId`, `read`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 8: REFRESH_TOKENS
-- Description: Refresh tokens for JWT authentication
-- ============================================
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(512) NOT NULL UNIQUE,
  `UserId` INT NOT NULL,
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  CONSTRAINT `fk_refresh_token_user` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_user_id` (`UserId`),
  INDEX `idx_expires_at` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 9: REVOKED_TOKENS
-- Description: Blacklist for revoked tokens
-- ============================================
CREATE TABLE IF NOT EXISTS `revoked_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token` TEXT NOT NULL,
  `tokenType` ENUM('access', 'refresh') NOT NULL DEFAULT 'access',
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_token` (`token`(255)),
  INDEX `idx_expires_at` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA - DEFAULT ADMIN USERS
-- ============================================

-- Note: Passwords are hashed with bcrypt
-- Password for all: admin123, captain123, staff123, resident123

-- Admin User
INSERT IGNORE INTO `Users` (`id`, `username`, `email`, `password`, `role`, `isVerified`) VALUES
(1, 'admin', 'admin@bakilid.gov.ph', '$2a$10$yourHashedPasswordHere', 'admin', 1);

-- Captain User
INSERT IGNORE INTO `Users` (`id`, `username`, `email`, `password`, `role`, `isVerified`) VALUES
(2, 'captain', 'captain@bakilid.gov.ph', '$2a$10$yourHashedPasswordHere', 'captain', 1);

-- Staff User
INSERT IGNORE INTO `Users` (`id`, `username`, `email`, `password`, `role`, `isVerified`) VALUES
(3, 'staff', 'staff@bakilid.gov.ph', '$2a$10$yourHashedPasswordHere', 'staff', 1);

-- ============================================
-- USEFUL QUERIES FOR COMMON OPERATIONS
-- ============================================

-- Get all pending verification requests
-- SELECT r.*, u.username, u.email 
-- FROM Residents r 
-- INNER JOIN Users u ON r.UserId = u.id 
-- WHERE r.verificationStatus = 'pending';

-- Get all pending document requests with resident info
-- SELECT req.*, r.firstName, r.lastName, r.contactNumber 
-- FROM Requests req 
-- INNER JOIN Residents r ON req.ResidentId = r.id 
-- WHERE req.status = 'Pending';

-- Get user with resident profile
-- SELECT u.*, r.* 
-- FROM Users u 
-- LEFT JOIN Residents r ON u.id = r.UserId 
-- WHERE u.id = ?;

-- Get all notifications for a user
-- SELECT * FROM Notifications 
-- WHERE UserId = ? 
-- ORDER BY createdAt DESC;

-- Clean up expired tokens
-- DELETE FROM refresh_tokens WHERE expiresAt < NOW();
-- DELETE FROM revoked_tokens WHERE expiresAt < NOW();

-- Get active announcements
-- SELECT * FROM Announcements 
-- WHERE status = 'Active' 
-- AND (expiryDate IS NULL OR expiryDate > NOW()) 
-- ORDER BY priority DESC, createdAt DESC;

-- ============================================
-- END OF SCHEMA
-- ============================================
