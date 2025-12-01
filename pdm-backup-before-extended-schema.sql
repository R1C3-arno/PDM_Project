mysqldump: [Warning] Using a password on the command line interface can be insecure.
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces
-- MySQL dump 10.13  Distrib 8.0.44, for Linux (aarch64)
--
-- Host: localhost    Database: pdm-project
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `term_months` int NOT NULL,
  `monthly_payment` decimal(15,2) NOT NULL,
  `total_payable` decimal(15,2) NOT NULL,
  `amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `remaining_balance` decimal(15,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `purpose` text,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_loans_user_id` (`user_id`),
  KEY `idx_loans_status` (`status`),
  CONSTRAINT `fk_loan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,2,10000.00,5.50,12,858.33,10300.00,2575.00,7725.00,'ACTIVE','Personal loan for home renovation','2024-01-15','2025-01-15','2025-11-23 15:30:50','2025-11-23 15:30:50'),(2,2,5000.00,6.00,24,221.60,5318.40,0.00,5318.40,'PENDING','Education loan',NULL,NULL,'2025-11-23 15:30:50','2025-11-23 15:30:50'),(3,3,20000.00,5.00,36,599.42,21579.00,11988.00,9591.00,'ACTIVE','Business expansion loan','2023-06-01','2026-06-01','2025-11-23 15:30:50','2025-11-23 15:30:50'),(4,4,3000.00,7.00,6,511.50,3069.00,3069.00,0.00,'COMPLETED','Emergency medical loan','2024-05-01','2024-11-01','2025-11-23 15:30:50','2025-11-23 15:30:50');
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_read` (`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'Loan Application Received','Your loan application for $5,000 has been received and is under review.','LOAN',0,'/loans','2025-11-23 15:30:50'),(2,2,'Payment Due Soon','Your loan payment of $858.33 is due on 2024-05-15.','PAYMENT',0,'/loans/1','2025-11-23 15:30:50'),(3,3,'Payment Received','We have received your payment of $599.42. Thank you!','PAYMENT',1,'/transactions','2025-11-23 15:30:50'),(4,3,'Support Ticket Update','Your support ticket #2 has been updated. Status: In Progress','SUPPORT',0,'/tickets/2','2025-11-23 15:30:50'),(5,4,'Loan Completed','Congratulations! Your loan #4 has been fully paid off.','LOAN',1,'/loans/4','2025-11-23 15:30:50'),(6,1,'New Support Ticket','A new support ticket #4 has been assigned to you.','ADMIN',0,'/admin/tickets/4','2025-11-23 15:30:50');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'OPEN',
  `priority` varchar(20) NOT NULL DEFAULT 'MEDIUM',
  `category` varchar(50) DEFAULT NULL,
  `assigned_to` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ticket_assigned` (`assigned_to`),
  KEY `idx_tickets_user_id` (`user_id`),
  KEY `idx_tickets_status` (`status`),
  CONSTRAINT `fk_ticket_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
INSERT INTO `support_tickets` VALUES (1,2,'Question about loan approval','I applied for a loan 3 days ago. When will it be approved?','OPEN','MEDIUM','LOAN_INQUIRY',1,'2025-11-23 15:30:50','2025-11-23 15:30:50',NULL),(2,3,'Unable to make payment','The payment button is not working on my loan page','IN_PROGRESS','HIGH','TECHNICAL',1,'2025-11-23 15:30:50','2025-11-23 15:30:50',NULL),(3,4,'Request for loan statement','I need a statement for my completed loan for tax purposes','RESOLVED','LOW','DOCUMENT_REQUEST',1,'2025-11-23 15:30:50','2025-11-23 15:30:50',NULL),(4,2,'Change phone number','I need to update my phone number in the system','OPEN','LOW','ACCOUNT',NULL,'2025-11-23 15:30:50','2025-11-23 15:30:50',NULL);
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `loan_id` bigint DEFAULT NULL,
  `wallet_id` bigint DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `status` varchar(20) NOT NULL DEFAULT 'COMPLETED',
  `reference_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_number` (`reference_number`),
  KEY `fk_transaction_wallet` (`wallet_id`),
  KEY `idx_transactions_user_id` (`user_id`),
  KEY `idx_transactions_loan_id` (`loan_id`),
  CONSTRAINT `fk_transaction_loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transaction_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,2,1,2,'LOAN_DISBURSEMENT',10000.00,'Loan #1 disbursed to wallet','COMPLETED','TXN-20240115-001','2025-11-23 15:30:50'),(2,2,1,2,'LOAN_PAYMENT',-858.33,'Monthly payment for Loan #1','COMPLETED','TXN-20240215-002','2025-11-23 15:30:50'),(3,2,1,2,'LOAN_PAYMENT',-858.33,'Monthly payment for Loan #1','COMPLETED','TXN-20240315-003','2025-11-23 15:30:50'),(4,2,1,2,'LOAN_PAYMENT',-858.34,'Monthly payment for Loan #1','COMPLETED','TXN-20240415-004','2025-11-23 15:30:50'),(5,3,3,3,'LOAN_DISBURSEMENT',20000.00,'Loan #3 disbursed to wallet','COMPLETED','TXN-20230601-005','2025-11-23 15:30:50'),(6,3,NULL,3,'DEPOSIT',5000.00,'Wallet deposit via bank transfer','COMPLETED','TXN-20241020-006','2025-11-23 15:30:50'),(7,4,4,4,'LOAN_DISBURSEMENT',3000.00,'Loan #4 disbursed to wallet','COMPLETED','TXN-20240501-007','2025-11-23 15:30:50'),(8,4,4,4,'LOAN_PAYMENT',-511.50,'Monthly payment for Loan #4','COMPLETED','TXN-20240601-008','2025-11-23 15:30:50');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'USER',
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@loanweb.com','$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na','Admin User','0344612654','ADMIN','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(2,'john.doe@example.com','$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na','John Doe','0767178267','USER','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(3,'jane.smith@example.com','$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na','Jane Smith','0363681624','USER','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(4,'bob.johnson@example.com','$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na','Bob Johnson','0902628125','USER','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_wallet` (`user_id`),
  KEY `idx_wallets_user_id` (`user_id`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES (1,1,50000.00,'USD','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(2,2,10500.50,'USD','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(3,3,25000.00,'USD','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50'),(4,4,5000.00,'USD','ACTIVE','2025-11-23 15:30:50','2025-11-23 15:30:50');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 15:53:53
