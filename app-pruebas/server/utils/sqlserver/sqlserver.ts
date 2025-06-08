import { Sequelize, DataTypes } from "sequelize";
import tedious from "tedious";

// Variable de entorno HOST_DB indica la IP o el nombre del servidor DB SQL Server
let hostdb = process.env.HOST_DB || "localhost";

// Configuración de Sequelize para SQL Server
const sequelizeSqlServer = new Sequelize({
  dialect: "mssql",
  database: "cafeteria",
  username: "sa",
  password: "Arevalo123_",
  host: hostdb,
  port: 1433,
  dialectOptions: {
    encrypt: true,
    trustServerCertificate: true // Evita problemas de certificados en conexiones locales
  }
});



// Tabla Categorías
const categoriasSqlServer = sequelizeSqlServer.define("categorias", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

// Tabla Productos
const productosSqlServer = sequelizeSqlServer.define("productos", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  idCategoria: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

// Tabla Órdenes
const ordenesSqlServer = sequelizeSqlServer.define("ordenes", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  fecha: { type: DataTypes.DATE, allowNull: false }, // Se usa DATE en vez de DATEONLY para SQL Server
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: false });

// Tabla Detalle Órdenes
const detalleordenesSqlServer = sequelizeSqlServer.define("detalleordenes", {
  idorden: { type: DataTypes.INTEGER, primaryKey: true },
  idproducto: { type: DataTypes.INTEGER, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: false });

// Asociaciones entre tablas
ordenesSqlServer.hasMany(detalleordenesSqlServer, { foreignKey: "idorden" });
detalleordenesSqlServer.belongsTo(ordenesSqlServer, { foreignKey: "idorden" });

productosSqlServer.hasMany(detalleordenesSqlServer, { foreignKey: "idproducto" });
detalleordenesSqlServer.belongsTo(productosSqlServer, { foreignKey: "idproducto" });

categoriasSqlServer.hasMany(productosSqlServer, { foreignKey: "idCategoria" });
productosSqlServer.belongsTo(categoriasSqlServer, { foreignKey: "idCategoria" });

// Exportación corregida
const db = {
  sequelizeSqlServer,
  categoriasSqlServer,
  productosSqlServer,
  ordenesSqlServer,
  detalleordenesSqlServer
};

export { sequelizeSqlServer, categoriasSqlServer, productosSqlServer, ordenesSqlServer, detalleordenesSqlServer };