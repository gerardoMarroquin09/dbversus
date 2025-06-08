-- PostgreSQL version of cafeteria schema

-- Drop schema if exists (optional, for clean start)
DROP SCHEMA IF EXISTS cafeteria CASCADE;

-- Create schema
CREATE SCHEMA cafeteria;

SET search_path TO cafeteria;

-- Table: categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(145) NOT NULL
);

-- Table: ordenes
CREATE TABLE ordenes (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  total NUMERIC(8,2) NOT NULL DEFAULT 0.00
);

-- Table: productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(145) NOT NULL,
  precio NUMERIC(8,2) DEFAULT 0.00,
  idCategoria INT NOT NULL,
  CONSTRAINT fkcategoria FOREIGN KEY (idCategoria)
    REFERENCES categorias (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Table: detalleordenes
CREATE TABLE detalleordenes (
  idorden INT NOT NULL,
  idproducto INT NOT NULL,
  cantidad INT NOT NULL,
  precio NUMERIC(8,2) NOT NULL,
  PRIMARY KEY (idorden, idproducto),
  CONSTRAINT fkordenes FOREIGN KEY (idorden)
    REFERENCES ordenes (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fkproductos FOREIGN KEY (idproducto)
    REFERENCES productos (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER ROLE admin SET search_path TO cafeteria;
