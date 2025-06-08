import { Sequelize, DataTypes } from "sequelize";

// Variable de entorno para la IP o nombre del servidor DB Oracle
let hostdb = process.env.HOST_DB || "localhost";

const sequelize = new Sequelize({
  dialect: 'oracle', // Especificamos que usamos Oracle
  host: hostdb,
  port: 1521,
  username: 'CAFETERIA',
  password: 'oracle',
  database: 'FREE', // Nombre del servicio (en Oracle, esto es el "service name")

});

// Tabla Categorias
const categorias = sequelize.define(
  "CATEGORIAS",
  {
    id: { // Usamos mayúsculas para coincidir con Oracle
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "ID", 
    },
    nombre: {
      type: DataTypes.STRING(145), // VARCHAR2(145)
      field: "NOMBRE",
    },
  },
  {
    timestamps: false,
    schema: "CAFETERIA",
    tableName: "CATEGORIAS",
  }
);

// Tabla Productos
const productos = sequelize.define(
  "PRODUCTOS",
  {
    id: 
    { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      field: "ID" 
    },
    nombre: 
    { 
      type: DataTypes.STRING, 
      allowNull: false,
      field: "NOMBRE"
     },
    precio: 
    { 
      type: DataTypes.FLOAT, 
      allowNull: false,
      field: "PRECIO" 
    },
    idCategoria: 
    { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: "IDCATEGORIA"
    },
  },
  { 
    timestamps: false,
    schema: "CAFETERIA",
    tableName: "PRODUCTOS",
   }
);

// Tabla Ordenes
const ordenes = sequelize.define(
  "ORDENES",
  {
    id: 
    { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      field: "ID"
    },
    fecha: 
    { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      field: "FECHA" 
    },
    total: 
    { 
      type: DataTypes.FLOAT, 
      allowNull: false,
      field: "TOTAL"
     },
  },
  { 
    timestamps: false,
    schema: "CAFETERIA",
    tableName: "ORDENES",
  }
);

// Tabla DetalleOrdenes
const detalleordenes = sequelize.define(
  "DETALLEORDENES",
  {
    idorden: 
    { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "IDORDEN"
    },
    idproducto: 
    { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      field: "IDPRODUCTO"
    },
    cantidad: 
    { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: "CANTIDAD"
    },
    precio: 
    { 
      type: DataTypes.FLOAT, 
      allowNull: false,
      field: "PRECIO"
    },
  },
  { 
    timestamps: false,
    schema: "CAFETERIA",
    tableName: "DETALLEORDENES",
  }
);

// Relaciones entre tablas
ordenes.hasMany(detalleordenes, { foreignKey: "idorden" });
detalleordenes.belongsTo(ordenes, { foreignKey: "idorden" });

productos.hasMany(detalleordenes, { foreignKey: "idproducto" });
detalleordenes.belongsTo(productos, { foreignKey: "idproducto" });

categorias.hasMany(productos, { foreignKey: "idCategoria" });
productos.belongsTo(categorias, { foreignKey: "idCategoria" });

const db = {
  sequelize,
  categorias,
  productos,
  ordenes,
  detalleordenes,
};

export { sequelize, categorias, productos, ordenes, detalleordenes };
