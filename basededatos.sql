DROP DATABASE IF EXISTS `ads_proyecto`;
CREATE DATABASE  IF NOT EXISTS `ads_proyecto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ads_proyecto`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: ads_proyecto
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `conexion`
--

DROP TABLE IF EXISTS `conexion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conexion` (
  `idconexion` int NOT NULL AUTO_INCREMENT,
  `id_origen` int NOT NULL,
  `id_destino` int NOT NULL,
  `etiqueta` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idconexion`),
  KEY `id_nodo_origen_idx` (`id_origen`),
  KEY `id_nodo_destino_idx` (`id_destino`),
  CONSTRAINT `id_nodo_destino` FOREIGN KEY (`id_destino`) REFERENCES `nodo` (`idnodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_nodo_origen` FOREIGN KEY (`id_origen`) REFERENCES `nodo` (`idnodo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conexion`
--

LOCK TABLES `conexion` WRITE;
/*!40000 ALTER TABLE `conexion` DISABLE KEYS */;
INSERT INTO `conexion` VALUES (1,1,2,NULL),(2,2,3,NULL),(3,3,4,'Si'),(4,3,5,'No'),(5,4,6,NULL),(6,5,6,NULL),(7,7,8,NULL),(8,8,9,NULL),(9,9,10,NULL),(10,10,11,'Si'),(11,11,8,'Regresar'),(12,10,12,'No'),(13,12,13,NULL),(14,13,14,NULL),(15,15,16,NULL),(16,16,17,NULL),(17,17,18,NULL),(18,18,19,'Si'),(19,19,20,NULL),(20,20,23,NULL),(21,18,21,'No'),(22,21,22,NULL),(23,22,16,'Intentar de nuevo');
/*!40000 ALTER TABLE `conexion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagrama`
--

DROP TABLE IF EXISTS `diagrama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagrama` (
  `id_diagrama` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime NOT NULL,
  `idusuario` int NOT NULL,
  PRIMARY KEY (`id_diagrama`),
  KEY `id_usuario_diagrama_idx` (`idusuario`),
  CONSTRAINT `id_usuario_diagrama` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagrama`
--

LOCK TABLES `diagrama` WRITE;
/*!40000 ALTER TABLE `diagrama` DISABLE KEYS */;
INSERT INTO `diagrama` VALUES (1,'Validacion de dato','2026-06-18 07:47:34','2026-06-18 07:47:34',1),(2,'Registro y promedio de alumnos','2026-06-20 20:51:03','2026-06-20 20:51:03',1),(3,'Validacion de acceso de usuario','2026-06-20 20:51:03','2026-06-20 20:51:03',1);
/*!40000 ALTER TABLE `diagrama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nodo`
--

DROP TABLE IF EXISTS `nodo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nodo` (
  `idnodo` int NOT NULL AUTO_INCREMENT,
  `id_diagrama` int NOT NULL,
  `id_tipo` int NOT NULL,
  `texto` varchar(100) DEFAULT NULL,
  `pos_x` int NOT NULL,
  `pos_y` int NOT NULL,
  PRIMARY KEY (`idnodo`),
  KEY `id_nodo_diagrama_idx` (`id_diagrama`),
  KEY `id_tipo_nodo_idx` (`id_tipo`),
  CONSTRAINT `id_nodo_diagrama` FOREIGN KEY (`id_diagrama`) REFERENCES `diagrama` (`id_diagrama`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_tipo_nodo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_componente` (`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nodo`
--

LOCK TABLES `nodo` WRITE;
/*!40000 ALTER TABLE `nodo` DISABLE KEYS */;
INSERT INTO `nodo` VALUES (1,1,1,'Inicio',100,50),(2,1,5,'Capturar dato',100,150),(3,1,4,'¿Dato > 0?',100,250),(4,1,3,'Procesar dato',50,350),(5,1,5,'Mostrar Error',250,350),(6,1,2,'Fin',150,500),(7,2,1,'Inicio',400,50),(8,2,5,'Leer nombre y calificacion',350,140),(9,2,3,'Acumular calificacion y aumentar contador',320,240),(10,2,4,'¿Hay mas alumnos?',370,350),(11,2,6,'A',180,430),(12,2,3,'Calcular promedio',600,430),(13,2,5,'Mostrar promedio del grupo',580,530),(14,2,2,'Fin',620,630),(15,3,1,'Inicio',400,50),(16,3,5,'Leer usuario y contraseña',350,140),(17,3,3,'Validar datos en el sistema',330,240),(18,3,4,'¿Credenciales correctas?',350,350),(19,3,3,'Crear sesión de usuario',600,440),(20,3,5,'Mostrar bienvenida',600,540),(21,3,5,'Mostrar usuario o contraseña incorrectos',80,440),(22,3,6,'A',180,560),(23,3,2,'Fin',620,650);
/*!40000 ALTER TABLE `nodo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_componente`
--

DROP TABLE IF EXISTS `tipo_componente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_componente` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_componente`
--

LOCK TABLES `tipo_componente` WRITE;
/*!40000 ALTER TABLE `tipo_componente` DISABLE KEYS */;
INSERT INTO `tipo_componente` VALUES (1,'inicio'),(2,'fin'),(3,'proceso'),(4,'decision'),(5,'entrada_salida'),(6,'conector');
/*!40000 ALTER TABLE `tipo_componente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `tipo_usuario` varchar(45) NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `usuario_UNIQUE` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin','1234','administrador');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-20 20:53:52

--Ejecutar para agregar la columna url_archivo a la tabla diagrama
USE ads_proyecto;
ALTER TABLE diagrama ADD COLUMN url_archivo VARCHAR(255) DEFAULT NULL;