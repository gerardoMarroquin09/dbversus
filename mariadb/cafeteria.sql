-- MariaDB Script Adaptado de MySQL Workbench (Sin AUTO_INCREMENT)
-- Fecha: Wed May 29 10:17:17 2024
-- Adaptado para MariaDB

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cafeteria
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `cafeteria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cafeteria`;

-- -----------------------------------------------------
-- Table `categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(145) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `ordenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ordenes` (
  `id` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `total` DECIMAL(8,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(145) NOT NULL,
  `precio` DECIMAL(8,2) NULL DEFAULT '0.00',
  `idCategoria` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fkcategoria_idx` (`idCategoria`),
  CONSTRAINT `fkcategoria`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `categorias` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `detalleordenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `detalleordenes` (
  `idorden` INT NOT NULL,
  `idproducto` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`idorden`, `idproducto`),
  INDEX `fkproductos_idx` (`idproducto`),
  CONSTRAINT `fkordenes`
    FOREIGN KEY (`idorden`)
    REFERENCES `ordenes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fkproductos`
    FOREIGN KEY (`idproducto`)
  REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
