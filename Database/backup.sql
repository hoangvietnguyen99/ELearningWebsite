-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: elearning
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `hash` varchar(1000) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `createdat` datetime DEFAULT CURRENT_TIMESTAMP,
  `otp` char(6) DEFAULT NULL,
  `otpexpired` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`email`),
  KEY `accounts_users_fk` (`userid`),
  CONSTRAINT `accounts_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (5,17,'hoangvietnguyen99@gmail.com','24a4cc390eeaf32fd63e91ad07e0c896b1138a52794005923a1821b772866af5ae3b1001eecb91ebbb5654e32b114d67cb3bb782e24bc9be2f76397667f6944f','d8d9fbd5f6e3c714c3d4555adbb635c6','2021-01-06 03:46:49',NULL,NULL),(6,18,'vuhoangnguyen@hitachiconsulting.com','73d44a08791ae6f6c67ed2d0282a795f4eaebbb38ce20fc38439a5002a3839952db9c0e2c3e5a642566c59472781bb96807f745e03bc13954ccb070d0945284d','9cf394276d8e179451545443e30da8ba','2021-01-06 03:48:48',NULL,NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `discount` int DEFAULT NULL,
  `ispaid` tinyint DEFAULT '0',
  `paiddate` datetime DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `amount` bigint DEFAULT '0',
  `discountamount` bigint DEFAULT '0',
  `total` bigint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `carts_users_fk` (`userid`),
  CONSTRAINT `carts_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts_courses`
--

DROP TABLE IF EXISTS `carts_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts_courses` (
  `cartid` int NOT NULL,
  `courseid` int NOT NULL,
  PRIMARY KEY (`cartid`,`courseid`),
  KEY `carts_courses_fk_courses` (`courseid`),
  CONSTRAINT `carts_courses_fk_carts` FOREIGN KEY (`cartid`) REFERENCES `carts` (`id`),
  CONSTRAINT `carts_courses_fk_courses` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts_courses`
--

LOCK TABLES `carts_courses` WRITE;
/*!40000 ALTER TABLE `carts_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_discount`
--

DROP TABLE IF EXISTS `course_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_discount` (
  `discountid` int NOT NULL,
  `courseid` int NOT NULL,
  PRIMARY KEY (`discountid`,`courseid`),
  KEY `course_discount_courses_fk` (`courseid`),
  CONSTRAINT `course_discount_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `course_discount_discounts_fk` FOREIGN KEY (`discountid`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_discount`
--

LOCK TABLES `course_discount` WRITE;
/*!40000 ALTER TABLE `course_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `author` int NOT NULL,
  `uploaddate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastupdatedat` datetime DEFAULT NULL,
  `description` text,
  `viewscount` int DEFAULT '0',
  `lessonscount` int DEFAULT '0',
  `getscount` int DEFAULT '0',
  `ratingscount` int DEFAULT '0',
  `rating` decimal(2,2) DEFAULT '0.00',
  `statuscode` varchar(15) DEFAULT 'UNAVAILABLE',
  `approvedby` int DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_users_fk` (`author`),
  KEY `courses_users_fk2` (`approvedby`),
  CONSTRAINT `courses_users_fk` FOREIGN KEY (`author`) REFERENCES `users` (`id`),
  CONSTRAINT `courses_users_fk2` FOREIGN KEY (`approvedby`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `description` text,
  `percent` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `discounts_chk_1` CHECK ((`percent` <= 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `field_course`
--

DROP TABLE IF EXISTS `field_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field_course` (
  `fieldid` int NOT NULL,
  `courseid` int NOT NULL,
  PRIMARY KEY (`fieldid`,`courseid`),
  KEY `field_course_courses_fk` (`courseid`),
  CONSTRAINT `field_course_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `field_course_fields_fk` FOREIGN KEY (`fieldid`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field_course`
--

LOCK TABLES `field_course` WRITE;
/*!40000 ALTER TABLE `field_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `field_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fields`
--

DROP TABLE IF EXISTS `fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `categoryid` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fields_categories_fk` (`categoryid`),
  CONSTRAINT `fields_categories_fk` FOREIGN KEY (`categoryid`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fields`
--

LOCK TABLES `fields` WRITE;
/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseid` int NOT NULL,
  `description` text,
  `videourl` text,
  PRIMARY KEY (`id`),
  KEY `lessons_courses_fk` (`courseid`),
  CONSTRAINT `lessons_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `userid` int NOT NULL,
  `courseid` int NOT NULL,
  `createddat` datetime DEFAULT CURRENT_TIMESTAMP,
  `point` int DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`userid`,`courseid`),
  KEY `ratings_courses_fk` (`courseid`),
  CONSTRAINT `ratings_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `ratings_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `ratings_chk_1` CHECK ((`point` <= 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('CNenps1AWBapcvSa8Fr4s28EeEHJz69L',1610011607,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":false,\"authUser\":null,\"authAccount\":null,\"retUrl\":\"http://localhost:3000/\",\"cart\":[]}'),('nZPO7BJA4R0v4Yovu5X1o9br8SN74VK0',1610008670,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"authUser\":{\"id\":17,\"roleid\":2,\"rolecode\":\"STUDENT\",\"statusid\":1,\"statuscode\":\"AVAILABLE\",\"firstname\":\"\",\"middlename\":null,\"lastname\":null,\"gender\":\"MALE\",\"address\":null,\"phone\":null,\"purchasedcount\":0,\"totalmoneyspend\":0,\"uploadedcount\":0,\"totalmoneyearn\":0,\"imgpath\":null,\"teachingdescription\":null,\"joinedat\":\"2021-01-05T20:46:49.000Z\"},\"authAccount\":{\"id\":5,\"userid\":17,\"email\":\"hoangvietnguyen99@gmail.com\",\"hash\":\"24a4cc390eeaf32fd63e91ad07e0c896b1138a52794005923a1821b772866af5ae3b1001eecb91ebbb5654e32b114d67cb3bb782e24bc9be2f76397667f6944f\",\"salt\":\"d8d9fbd5f6e3c714c3d4555adbb635c6\",\"createdat\":\"2021-01-05T20:46:49.000Z\",\"otp\":null,\"otpexpired\":null},\"retUrl\":\"http://localhost:3000/\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_course`
--

DROP TABLE IF EXISTS `user_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_course` (
  `userid` int NOT NULL,
  `courseid` int NOT NULL,
  `purchasedat` datetime DEFAULT CURRENT_TIMESTAMP,
  `amount` bigint DEFAULT NULL,
  `isinwatchlist` tinyint(1) DEFAULT '0',
  `process` decimal(3,2) DEFAULT '0.00',
  `currentlesson` int DEFAULT NULL,
  `currentpause` varchar(10) DEFAULT '00:00',
  PRIMARY KEY (`userid`,`courseid`),
  KEY `user_course_courses_fk` (`courseid`),
  CONSTRAINT `user_course_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `user_course_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_course`
--

LOCK TABLES `user_course` WRITE;
/*!40000 ALTER TABLE `user_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(15) DEFAULT 'STUDENT',
  `status` varchar(15) DEFAULT 'AVAILABLE',
  `fullname` varchar(100) DEFAULT NULL,
  `gender` varchar(6) DEFAULT 'MALE',
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `purchasedcount` int DEFAULT '0',
  `totalmoneyspend` bigint DEFAULT '0',
  `uploadedcount` int DEFAULT '0',
  `totalmoneyearn` bigint DEFAULT '0',
  `teachingdescription` text,
  `joinedat` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'STUDENT','AVAILABLE','','male',NULL,NULL,0,0,0,0,NULL,'2021-01-06 02:05:34'),(2,'STUDENT','AVAILABLE','','male',NULL,NULL,0,0,0,0,NULL,'2021-01-06 02:07:48'),(3,'STUDENT','AVAILABLE','','male',NULL,NULL,0,0,0,0,NULL,'2021-01-06 02:08:06'),(17,'STUDENT','AVAILABLE','','MALE',NULL,NULL,0,0,0,0,NULL,'2021-01-06 03:46:49'),(18,'STUDENT','AVAILABLE','','MALE',NULL,NULL,0,0,0,0,NULL,'2021-01-06 03:48:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-06 15:17:57
