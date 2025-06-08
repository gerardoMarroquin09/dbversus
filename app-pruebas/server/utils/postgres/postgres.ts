import { Sequelize, DataTypes } from "sequelize";

let hostdb = process.env.HOST_DB || 'localhost';

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'cafeteria',
    username: 'admin',
    password: 'admin',
    host: hostdb,
    port: 5432,
    
});

// Tabla Categorias
const categorias = sequelize.define('categorias', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false});

// Tabla Productos
const productos = sequelize.define('productos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  idcategoria: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

// Tabla Ordenes
const ordenes = sequelize.define('ordenes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: false });

// Tabla DetalleOrdenes
const detalleordenes = sequelize.define('detalleordenes', {
  idorden: { type: DataTypes.INTEGER, primaryKey: true },
  idproducto: { type: DataTypes.INTEGER, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: false });

// Relaciones
ordenes.hasMany(detalleordenes, { foreignKey: 'idorden' });
detalleordenes.belongsTo(ordenes, { foreignKey: 'idorden' });
productos.hasMany(detalleordenes, { foreignKey: 'idproducto' });
detalleordenes.belongsTo(productos, { foreignKey: 'idproducto' });
categorias.hasMany(productos, { foreignKey: 'idcategoria' });
productos.belongsTo(categorias, { foreignKey: 'idcategoria' });

const db={
    sequelize,
    categorias,
    productos,
    ordenes,
    detalleordenes
}
//exporto dos objetos el objeto db.sequelize y el objeto categorias
//export default db;
export {sequelize, categorias, productos, ordenes, detalleordenes}; //exporto dos objetos el objeto db.sequelize y el objeto categorias