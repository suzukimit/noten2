-- MySQL dump 10.13  Distrib 5.6.13, for osx10.7 (x86_64)
--
-- Host: 127.0.0.1    Database: noten
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notebook`
--

DROP TABLE IF EXISTS `notebook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notebook` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `version` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5wxiq4t1i6eudqtece24teeqh` (`user_id`),
  CONSTRAINT `FK5wxiq4t1i6eudqtece24teeqh` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phrase`
--

DROP TABLE IF EXISTS `phrase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phrase` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `version` bigint NOT NULL,
  `abc` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `length` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `meter` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `reference` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `notebook_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhoqs89nla2e4ud77230uxsk50` (`user_id`),
  KEY `FKsssvc4ov90jmwwtvlkecapbyt` (`notebook_id`),
  CONSTRAINT `FKhoqs89nla2e4ud77230uxsk50` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKsssvc4ov90jmwwtvlkecapbyt` FOREIGN KEY (`notebook_id`) REFERENCES `notebook` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `version` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKld85w5kr7ky5w4wda3nrdo0p8` (`user_id`),
  CONSTRAINT `FKld85w5kr7ky5w4wda3nrdo0p8` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tag_phrases`
--

DROP TABLE IF EXISTS `tag_phrases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_phrases` (
  `tags_id` bigint NOT NULL,
  `phrases_id` bigint NOT NULL,
  PRIMARY KEY (`tags_id`,`phrases_id`),
  KEY `FKbskaawt2dkeyh6go30an5avgs` (`phrases_id`),
  CONSTRAINT `FKbgjqw21iv2wpsb5hpw9egxesr` FOREIGN KEY (`tags_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `FKbskaawt2dkeyh6go30an5avgs` FOREIGN KEY (`phrases_id`) REFERENCES `phrase` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `version` bigint NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  KEY `FK388j0vyq4hnj72xl53tdls2u4` (`user_id`),
  CONSTRAINT `FK388j0vyq4hnj72xl53tdls2u4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-24 21:41:04
