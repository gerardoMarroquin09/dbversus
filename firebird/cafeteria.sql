-- -----------------------------------------------------
-- Schema cafeteria
-- -----------------------------------------------------

-- En Firebird, no es necesario definir un esquema como en MySQL
-- simplemente usamos las tablas dentro de la base de datos

-- -----------------------------------------------------
-- Table cafeteria.categorias
-- -----------------------------------------------------
CREATE SEQUENCE seq_categorias_id; -- Crear secuencia para la tabla categorias

CREATE TABLE categorias (
  id INTEGER NOT NULL PRIMARY KEY, -- Quitamos el DEFAULT
  nombre VARCHAR(145) NOT NULL
);

-- -----------------------------------------------------
-- Table cafeteria.ordenes
-- -----------------------------------------------------
CREATE SEQUENCE seq_ordenes_id; -- Crear secuencia para la tabla ordenes

CREATE TABLE ordenes (
  id INTEGER NOT NULL PRIMARY KEY, -- Quitamos el DEFAULT
  fecha DATE NOT NULL,
  total NUMERIC(8,2) NOT NULL
);

-- -----------------------------------------------------
-- Table cafeteria.productos
-- -----------------------------------------------------
CREATE SEQUENCE seq_productos_id; -- Crear secuencia para la tabla productos

CREATE TABLE productos (
  id INTEGER NOT NULL PRIMARY KEY, -- Quitamos el DEFAULT
  nombre VARCHAR(145) NOT NULL,
  precio NUMERIC(8,2),
  idCategoria INTEGER NOT NULL,
  CONSTRAINT fk_categoria FOREIGN KEY (idCategoria) REFERENCES categorias(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table cafeteria.detalleordenes
-- -----------------------------------------------------
CREATE TABLE detalleordenes (
  idorden INTEGER NOT NULL,
  idproducto INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  precio NUMERIC(8,2) NOT NULL,
  CONSTRAINT pk_detalleordenes PRIMARY KEY (idorden, idproducto),
  CONSTRAINT fk_orden FOREIGN KEY (idorden) REFERENCES ordenes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_producto FOREIGN KEY (idproducto) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Insertar datos de ejemplo
-- -----------------------------------------------------

-- Insertar una categoría
-- -----------------------------------------------------
-- INSERT INTO categorias (id, nombre) VALUES (1, 'Bebidas');

-- Insertar productos con valores explícitos de id
-- Aquí, estamos insertando productos con id explícitos (1 y 2)
-- INSERT INTO productos (id, nombre, precio, idCategoria) VALUES (1, 'Café', 2.50, 1);
-- INSERT INTO productos (id, nombre, precio, idCategoria) VALUES (2, 'Té', 1.75, 1);

-- Insertar una orden
-- INSERT INTO ordenes (id, fecha, total) VALUES (1, '2025-03-23', 50.75);

-- Insertar detalles de orden con valores que ahora existen en productos
-- INSERT INTO detalleordenes (idorden, idproducto, cantidad, precio) VALUES (1, 1, 2, 5.00);
-- INSERT INTO detalleordenes (idorden, idproducto, cantidad, precio) VALUES (1, 2, 3, 1.75);