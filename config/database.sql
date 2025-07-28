-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: boleta_app
-- ------------------------------------------------------
-- Server version	8.4.5-0ubuntu0.2

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
-- Current Database: `boleta_app`
--

/*!40000 DROP DATABASE IF EXISTS `boleta_app`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `boleta_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `boleta_app`;

--
-- Table structure for table `boletas`
--

DROP TABLE IF EXISTS `boletas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boletas` (
  `id_boleta` int NOT NULL AUTO_INCREMENT,
  `codigo_boleta` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ruc_empresa` varchar(15) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `dni_cliente` varchar(15) NOT NULL,
  `ruc_cliente` varchar(20) DEFAULT NULL,
  `nombre_trabajador` varchar(100) NOT NULL,
  `dni_trabajador` varchar(15) NOT NULL,
  `total_boleta` decimal(10,2) NOT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'pendiente',
  `fecha_pago` datetime DEFAULT NULL,
  PRIMARY KEY (`id_boleta`),
  UNIQUE KEY `codigo_boleta` (`codigo_boleta`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletas`
--

LOCK TABLES `boletas` WRITE;
/*!40000 ALTER TABLE `boletas` DISABLE KEYS */;
INSERT INTO `boletas` (`id_boleta`, `codigo_boleta`, `fecha`, `ruc_empresa`, `nombre_cliente`, `dni_cliente`, `ruc_cliente`, `nombre_trabajador`, `dni_trabajador`, `total_boleta`, `estado`, `fecha_pago`) VALUES (1,'BOL1753668712040','2025-07-27 21:11:52','1234567889','Juan Pérez','12345678',NULL,'Carlos Gómez','87654321',120.50,'pendiente',NULL),(2,'BOL1753668712041','2025-07-27 21:39:07','12345678901','Juan Pérez','12345678','20123456789','María García','87654321',150.75,'pendiente',NULL),(5,'BOL1753668712042','2025-07-28 18:12:22','12345678901','Test User','12345678','12345678901','Test Worker','87654321',88.90,'activa',NULL),(6,'BOL1753668712043','2025-07-28 18:13:37','12345678901','asdqwd','4189141','51615012','opjmodpmasd','168415',88.90,'activa',NULL);
/*!40000 ALTER TABLE `boletas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_boleta`
--

DROP TABLE IF EXISTS `detalle_boleta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_boleta` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `codigo_boleta` varchar(50) NOT NULL,
  `id_producto` int unsigned NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `codigo_boleta` (`codigo_boleta`),
  KEY `detalle_boleta_ibfk_2` (`id_producto`),
  CONSTRAINT `detalle_boleta_ibfk_1` FOREIGN KEY (`codigo_boleta`) REFERENCES `boletas` (`codigo_boleta`),
  CONSTRAINT `detalle_boleta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_boleta`
--

LOCK TABLES `detalle_boleta` WRITE;
/*!40000 ALTER TABLE `detalle_boleta` DISABLE KEYS */;
INSERT INTO `detalle_boleta` (`id_detalle`, `codigo_boleta`, `id_producto`, `cantidad`, `subtotal`) VALUES (1,'BOL1753668712042',1,1,88.90),(2,'BOL1753668712043',1,1,88.90);
/*!40000 ALTER TABLE `detalle_boleta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`) VALUES (1,'mouse','raton',88.90,10),(2,'Laptop Gamer MSI','Laptop gaming con procesador Intel i7, 16GB RAM, RTX 3060',899999.00,15),(3,'Mouse Logitech G502','Mouse gaming con sensor óptico de alta precisión',45990.00,50),(4,'Teclado Mecánico Corsair','Teclado mecánico RGB con switches Cherry MX Blue',89990.00,25),(5,'Monitor 4K Samsung','Monitor 27 pulgadas 4K UHD con tecnología HDR',299990.00,8),(6,'Auriculares Sony WH-1000XM4','Auriculares inalámbricos con cancelación de ruido',199990.00,20),(7,'SSD Samsung 1TB','Disco sólido NVMe M.2 de alta velocidad',89990.00,30),(8,'Webcam Logitech C920','Cámara web Full HD 1080p para streaming',65990.00,40),(9,'Smartphone iPhone 15','iPhone 15 128GB con chip A17 Pro',999990.00,12),(10,'Tablet iPad Air','iPad Air 10.9 pulgadas 256GB WiFi',599990.00,18),(11,'Impresora HP LaserJet','Impresora láser monocromática con WiFi',149990.00,10),(12,'Router ASUS AX6000','Router WiFi 6 de alto rendimiento',249990.00,15),(13,'Micrófono Blue Yeti','Micrófono USB profesional para streaming',129990.00,22),(14,'Tarjeta Gráfica RTX 4070','Tarjeta gráfica NVIDIA GeForce RTX 4070 12GB',599990.00,6),(15,'Procesador AMD Ryzen 7','Procesador AMD Ryzen 7 5800X 8 núcleos',289990.00,14),(16,'Memoria RAM Corsair 32GB','Kit memoria DDR4 32GB (2x16GB) 3200MHz',159990.00,25),(17,'Fuente EVGA 750W','Fuente de poder modular 80+ Gold 750W',119990.00,20),(18,'Case Corsair RGB','Gabinete ATX con iluminación RGB y ventiladores',99990.00,12),(19,'Cooler Noctua NH-D15','Cooler de CPU de alto rendimiento ultra silencioso',89990.00,18),(20,'Cable HDMI 4K','Cable HDMI 2.1 de 2 metros compatible con 4K 120Hz',19990.00,100),(21,'Hub USB-C','Hub USB-C 7 en 1 con HDMI y carga rápida',39990.00,35),(22,'Laptop Gamer MSI','Laptop gaming con procesador Intel i7, 16GB RAM, RTX 3060',899999.00,15),(23,'Mouse Logitech G502','Mouse gaming con sensor óptico de alta precisión',45990.00,50),(24,'Teclado Mecánico Corsair','Teclado mecánico RGB con switches Cherry MX Blue',89990.00,25),(25,'Monitor 4K Samsung','Monitor 27 pulgadas 4K UHD con tecnología HDR',299990.00,8),(26,'Auriculares Sony WH-1000XM4','Auriculares inalámbricos con cancelación de ruido',199990.00,20),(27,'SSD Samsung 1TB','Disco sólido NVMe M.2 de alta velocidad',89990.00,30),(28,'Webcam Logitech C920','Cámara web Full HD 1080p para streaming',65990.00,40),(29,'Smartphone iPhone 15','iPhone 15 128GB con chip A17 Pro',999990.00,12),(30,'Tablet iPad Air','iPad Air 10.9 pulgadas 256GB WiFi',599990.00,18),(31,'Impresora HP LaserJet','Impresora láser monocromática con WiFi',149990.00,10),(32,'Router ASUS AX6000','Router WiFi 6 de alto rendimiento',249990.00,15),(33,'Micrófono Blue Yeti','Micrófono USB profesional para streaming',129990.00,22),(34,'Tarjeta Gráfica RTX 4070','Tarjeta gráfica NVIDIA GeForce RTX 4070 12GB',599990.00,6),(35,'Procesador AMD Ryzen 7','Procesador AMD Ryzen 7 5800X 8 núcleos',289990.00,14),(36,'Memoria RAM Corsair 32GB','Kit memoria DDR4 32GB (2x16GB) 3200MHz',159990.00,25),(37,'Fuente EVGA 750W','Fuente de poder modular 80+ Gold 750W',119990.00,20),(38,'Case Corsair RGB','Gabinete ATX con iluminación RGB y ventiladores',99990.00,12),(39,'Cooler Noctua NH-D15','Cooler de CPU de alto rendimiento ultra silencioso',89990.00,18),(40,'Cable HDMI 4K','Cable HDMI 2.1 de 2 metros compatible con 4K 120Hz',19990.00,100),(41,'Hub USB-C','Hub USB-C 7 en 1 con HDMI y carga rápida',39990.00,35),(42,'Test Product','This is a test product',29990.00,50);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'boleta_app'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-28 18:34:17

