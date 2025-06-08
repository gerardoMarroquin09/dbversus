-- Crear Keyspace
CREATE KEYSPACE IF NOT EXISTS cafeteria
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE cafeteria;

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY,
  nombre TEXT
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY,
  nombre TEXT,
  precio DECIMAL,
  idCategoria UUID
);

-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
  id UUID PRIMARY KEY,
  fecha DATE,
  total DECIMAL
);

-- Crear tabla de detalle de órdenes
CREATE TABLE IF NOT EXISTS detalleordenes (
  idOrden UUID,
  idProducto UUID,
  cantidad INT,
  precio DECIMAL,
  PRIMARY KEY (idOrden, idProducto)
);
