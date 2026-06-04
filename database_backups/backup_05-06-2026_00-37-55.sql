-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: municipal_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `ix_admins_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'TestAdmin1','9999999999','$2b$12$ByyC3anvlj9gQtD2oQ7nouFa/4BP4pia8BH17wZB6MpkkN.J62/bu','2026-06-01 21:54:34');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` varchar(20) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `selfie_url` varchar(500) NOT NULL,
  `manual_marked` tinyint(1) DEFAULT NULL,
  `updated_by_admin` tinyint(1) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `ix_attendance_id` (`id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2026-06-02','19:13:50','absent',26.7271,88.3953,'attendance_images/selfie_1.jpg',0,0,NULL,'2026-06-02 19:13:49'),(2,2,'2026-06-02','20:13:10','absent',26.7271,88.3953,'attendance_images/amit_selfie.jpg',0,0,NULL,'2026-06-02 20:13:09'),(3,1,'2026-06-03','11:52:28','late',26.7271,88.3953,'attendance_images/rahul_selfie.jpg',0,0,NULL,'2026-06-03 11:52:27'),(4,2,'2026-06-03','14:54:31','present',0,0,'manual_entry.jpg',1,1,NULL,'2026-06-03 14:54:30'),(5,3,'2026-06-03','15:06:00','present',0,0,'MANUAL_ATTENDANCE',1,1,NULL,'2026-06-03 15:05:59'),(6,4,'2026-06-03','21:29:16','present',0,0,'MANUAL_ATTENDANCE',1,1,NULL,'2026-06-03 21:29:16');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int NOT NULL,
  `details` text,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (2,1,'CREATE_OFFICE','Office',4,'Created office Ward Office 2','2026-06-03 21:24:59'),(3,1,'CREATE_EMPLOYEE','Employee',4,'Created employee Rakesh Roy','2026-06-03 21:26:04'),(4,1,'UPDATE_EMPLOYEE','Employee',1,'Updated employee Rahul Das Updated','2026-06-03 21:27:16'),(5,1,'CHANGE_EMPLOYEE_STATUS','Employee',2,'Status changed to inactive','2026-06-03 21:27:57'),(6,1,'CHANGE_EMPLOYEE_STATUS','Employee',2,'Status changed to active','2026-06-03 21:28:06'),(7,1,'CREATE_TASK','Task',2,'Assigned task \'Road Inspection\' to employee 1','2026-06-03 21:28:30'),(8,1,'MANUAL_ATTENDANCE','Attendance',6,'Marked present for employee 4','2026-06-03 21:29:16'),(9,1,'DELETE_OFFICE','Office',2,'Deleted office UpdatedWardOffice2','2026-06-04 12:04:28'),(10,1,'DELETE_TASK_IMAGE','TaskImage',2,'Admin deleted task evidence image','2026-06-04 21:53:37'),(11,1,'DELETE_TASK_IMAGE','TaskImage',3,'Admin deleted task evidence image','2026-06-04 23:12:47'),(12,1,'DELETE_TASK_IMAGE','TaskImage',5,'Admin deleted task evidence image','2026-06-04 23:13:52'),(13,1,'DELETE_TASK_IMAGE','TaskImage',7,'Admin deleted task evidence image','2026-06-05 00:22:42'),(14,1,'DELETE_TASK_IMAGE','TaskImage',6,'Admin deleted task evidence image','2026-06-05 00:25:02');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `office_id` int NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `office_id` (`office_id`),
  KEY `ix_employees_id` (`id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Rahul Das Updated','9998887776','$2b$12$eP3MhZkrtQo5xcWqu5ahPu191QtP/ewpX.RmyRZ1j0tf3UhB9afCO',1,'active','2026-06-02 12:41:29'),(2,'Amit Kumar','8887776665','$2b$12$IIjYek7CdgS8/0euINRY4OnNr1WvnlNb0JL1f4/2NXNe6GF2PLxhW',1,'active','2026-06-02 20:12:39'),(3,'Suresh Das','7776665554','$2b$12$vDd8D8p7NDb8rR7JlwnyxOmJqLAq/jXvQ7Arv4ZVmE5SSvsVc21DW',1,'active','2026-06-02 20:14:36'),(4,'Rakesh Roy','6665554443','$2b$12$euf4YERIT5hsZ42r15oY4.X6i/dhCy3n5Y9O07B0iOXWF80FJilsO',1,'active','2026-06-03 21:26:04');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `error_logs`
--

DROP TABLE IF EXISTS `error_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `error_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route` varchar(255) NOT NULL,
  `error_message` varchar(1000) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_error_logs_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `error_logs`
--

LOCK TABLES `error_logs` WRITE;
/*!40000 ALTER TABLE `error_logs` DISABLE KEYS */;
INSERT INTO `error_logs` VALUES (1,'/crash-test','division by zero','2026-06-03 19:00:14'),(2,'/reports/tasks/03-06-2026','\'Task\' object has no attribute \'created_at\'','2026-06-04 14:20:30'),(3,'/reports/tasks/03-06-2026','\'Task\' object has no attribute \'created_at\'','2026-06-04 14:24:45'),(4,'/tasks/2','\'Task\' object has no attribute \'created_at\'','2026-06-04 14:34:55'),(5,'/tasks/2','\'Task\' object has no attribute \'created_at\'','2026-06-04 14:36:52'),(6,'/tasks/2/complete','can\'t compare offset-naive and offset-aware datetimes','2026-06-04 14:56:22'),(7,'/tasks/2/complete','can\'t compare offset-naive and offset-aware datetimes','2026-06-04 14:57:17');
/*!40000 ALTER TABLE `error_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `office_name` varchar(100) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `radius_meters` int NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_offices_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'TestWardOffice1',26.7271,88.3953,100,'2026-06-02 01:17:21'),(4,'Ward Office 2',26.7271,88.3953,500,'2026-06-03 21:24:59');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_images`
--

DROP TABLE IF EXISTS `task_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `uploaded_at` datetime DEFAULT (now()),
  `public_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `ix_task_images_id` (`id`),
  CONSTRAINT `task_images_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_images`
--

LOCK TABLES `task_images` WRITE;
/*!40000 ALTER TABLE `task_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `employee_id` int NOT NULL,
  `assigned_by` int NOT NULL,
  `assigned_at` datetime DEFAULT (now()),
  `deadline` datetime NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `is_late` tinyint(1) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `completion_lat` float DEFAULT NULL,
  `completion_lng` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `ix_tasks_id` (`id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_by`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Drain Cleaning','Clean drain near Bidhan Market',1,1,'2026-06-02 20:54:35','2026-06-05 14:00:00','completed',0,'2026-06-02 21:08:11',26.7271,88.3953),(2,'Road Inspection','Inspect road condition near City Center',1,1,'2026-06-03 21:28:30','2026-06-10 17:00:00','completed',0,'2026-06-04 21:47:32',23.456,23.456);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05  0:37:58
