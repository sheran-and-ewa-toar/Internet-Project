-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: mirna_classifier_db
-- ------------------------------------------------------
-- Server version	9.7.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '7514b659-6cf7-11f1-8bb2-541b3232560d:1-4833';

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(10) NOT NULL,
  `lastName` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL DEFAULT 'user',
  `theme` varchar(255) NOT NULL DEFAULT 'light',
  `createDate` datetime NOT NULL,
  `updateDate` datetime NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Ewa','Yo','ewa.yo@yoyo.com','pbkdf2$573b81ad9f030852c23483f56a69581a$1799b3ae11599c7d79f8dc1e3c6e54ffdfebe9c43054df464f9fdff565cf6af2d8f87ce0547fe75794c468b0ef94fb58acd5b980803c1bf7b8f3f6129f7d03d2','admin','pink','2026-05-10 12:00:00','2026-06-05 23:02:54'),(2,'Sheran','Smol','sheran.smol@example.com','pbkdf2$28537f6c12141331fe38d20e06d58317$8b7d24325c0b0ccd6296308738d0a1b972d317a1b4076aa890b84bd90363effe15ba115050d31ff39a7fbd0321509fa3aca8798547df4dbdca3177d1cff0bb78','user','teal','2026-05-10 12:00:00','2026-05-10 12:00:00'),(3,'Alice','Jones','email@ex.com','pbkdf2$bc11769e0c9c09154b34f887353d419d$63f77ad5e856792bbe2332f47ad4582ca0842971bd06484a70455f89b7177c01299c34f09006a4c81a6fb37569e53a62bbc87f9ab856fa37cb7989cec262b635','user','pink','2026-05-10 12:00:00','2026-06-21 21:36:41'),(4,'Alice','Smith','alice.smith@example.com','pbkdf2$ba08232b3151cbb983f3d8bcb0fc4ea9$7385563158b1803b7c409a87abf3f7db9c20a4231aee4efd3ffef0d035601a76a9a80cd9a3c5adc0cf47ae3fba363c4a663438580e89dac264da68f51606bd0b','manager','light','2026-05-30 12:30:34','2026-05-30 12:30:34'),(5,'tamsy','caines','angel@sphere.com','pbkdf2$f580b38cdd92ae9e06de0ccb4d87ccfa$3e5ef795fec9b7f3552c635c438d62aeed64c3933a8b9a3e9a38d353bfc6f3e66cd3c18919b31c478534efb47cd9145cade7ddc00a9318dcf67d054710500b96','user','pink','2026-06-05 20:32:12','2026-06-05 23:12:36'),(7,'Alice','Banaranga','mail@mail.com','pbkdf2$34f6eb08f79eaaf3624120eeeda51e49$bea562683245799f7d539de7a0ae6bb8053de6bb38205c329e851bb8bbfe7c1fc7ea784390927ab79a08890e6aeeb2823cd068922c47012eb1a3f5344ac31a9c','manager','dark','2026-06-21 21:09:09','2026-06-21 21:12:33');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22  0:50:00
