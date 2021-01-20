CREATE DATABASE  IF NOT EXISTS `elearning` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `elearning`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: elearningmysql.mysql.database.azure.com    Database: elearning
-- ------------------------------------------------------
-- Server version	5.6.47.0

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

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `discount` int(11) DEFAULT NULL,
  `ispaid` tinyint(4) DEFAULT '0',
  `paiddate` datetime DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `amount` bigint(20) DEFAULT '0',
  `discountamount` bigint(20) DEFAULT '0',
  `total` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `carts_users_fk` (`userid`),
  CONSTRAINT `carts_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carts_courses`
--

DROP TABLE IF EXISTS `carts_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts_courses` (
  `cartid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  PRIMARY KEY (`cartid`,`courseid`),
  KEY `carts_courses_fk_courses` (`courseid`),
  CONSTRAINT `carts_courses_fk_carts` FOREIGN KEY (`cartid`) REFERENCES `carts` (`id`),
  CONSTRAINT `carts_courses_fk_courses` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_discount`
--

DROP TABLE IF EXISTS `course_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_discount` (
  `discountid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  PRIMARY KEY (`discountid`,`courseid`),
  KEY `course_discount_courses_fk` (`courseid`),
  CONSTRAINT `course_discount_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `course_discount_discounts_fk` FOREIGN KEY (`discountid`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `author` int(11) NOT NULL,
  `uploaddate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastupdatedat` datetime DEFAULT NULL,
  `description` text,
  `viewscount` int(11) DEFAULT '0',
  `lessonscount` int(11) DEFAULT '0',
  `getscount` int(11) DEFAULT '0',
  `ratingscount` int(11) DEFAULT '0',
  `rating` double DEFAULT '0',
  `statuscode` varchar(15) DEFAULT 'INCOMPLETE',
  `approvedby` int(11) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `commentscount` int(11) DEFAULT '0',
  `imgpath` text,
  `tinydes` text,
  `currenlessonorder` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `courses_users_fk` (`author`),
  KEY `courses_users_fk2` (`approvedby`),
  FULLTEXT KEY `name` (`name`),
  CONSTRAINT `courses_users_fk` FOREIGN KEY (`author`) REFERENCES `users` (`id`),
  CONSTRAINT `courses_users_fk2` FOREIGN KEY (`approvedby`) REFERENCES `users` (`id`)
) /*!50100 TABLESPACE `innodb_system` */ ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `description` text,
  `percent` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `field_course`
--

DROP TABLE IF EXISTS `field_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field_course` (
  `fieldid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  PRIMARY KEY (`fieldid`,`courseid`),
  KEY `field_course_courses_fk` (`courseid`),
  CONSTRAINT `field_course_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `field_course_fields_fk` FOREIGN KEY (`fieldid`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fields`
--

DROP TABLE IF EXISTS `fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `categoryid` int(11) NOT NULL,
  `imgpath` text,
  `getscount` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fields_categories_fk` (`categoryid`),
  FULLTEXT KEY `namefts` (`name`),
  CONSTRAINT `fields_categories_fk` FOREIGN KEY (`categoryid`) REFERENCES `categories` (`id`)
) /*!50100 TABLESPACE `innodb_system` */ ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseid` int(11) NOT NULL,
  `description` text,
  `videourl` text,
  `title` varchar(50) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lessons_courses_fk` (`courseid`),
  CONSTRAINT `lessons_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `userid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  `createddat` datetime DEFAULT CURRENT_TIMESTAMP,
  `point` int(11) DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`userid`,`courseid`),
  KEY `ratings_courses_fk` (`courseid`),
  CONSTRAINT `ratings_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `ratings_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(10) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_course`
--

DROP TABLE IF EXISTS `user_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_course` (
  `userid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  `purchasedat` datetime DEFAULT CURRENT_TIMESTAMP,
  `amount` bigint(20) DEFAULT NULL,
  `isinwatchlist` tinyint(1) DEFAULT '0',
  `process` int(11) DEFAULT '0',
  `currentlesson` int(11) DEFAULT '0',
  `lessonorder` int(11) DEFAULT '0',
  `currentpause` double DEFAULT '0',
  PRIMARY KEY (`userid`,`courseid`),
  KEY `user_course_courses_fk` (`courseid`),
  CONSTRAINT `user_course_courses_fk` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`),
  CONSTRAINT `user_course_users_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) /*!50100 TABLESPACE `innodb_system` */ ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(15) DEFAULT 'STUDENT',
  `status` varchar(15) DEFAULT 'AVAILABLE',
  `fullname` varchar(100) DEFAULT NULL,
  `gender` varchar(6) DEFAULT 'MALE',
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `purchasedcount` int(11) DEFAULT '0',
  `totalmoneyspend` bigint(20) DEFAULT '0',
  `uploadedcount` int(11) DEFAULT '0',
  `totalmoneyearn` bigint(20) DEFAULT '0',
  `teachingdescription` text,
  `joinedat` datetime DEFAULT CURRENT_TIMESTAMP,
  `teachstatus` varchar(15) DEFAULT NULL,
  `imgpath` text,
  `isvalid` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'elearning'
--

--
-- Dumping routines for database 'elearning'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-20 11:19:43
