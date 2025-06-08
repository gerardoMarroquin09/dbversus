import { Sequelize, DataTypes } from "sequelize";

// Variable de entornos HOSTDB indica la ip o el nombre del servidor DB mariadb
let hostdb = process.env.HOST_DB || 'localhost';

const sequelize = new Sequelize({
    dialect: 'mariadb',
    database: 'cafeteria',
    username: 'root',
    password: 'root',
    host: hostdb,
    port: 3306
});

// Tabla Categorias
const categorias = sequelize.define('categorias', 
{
  id: { type: DataTypes.NUMBER, primaryKey: true},
  nombre: { type: DataTypes.STRING , allowNull: false},
}, 
{
  timestamps: false //no crea campos createdAt ni updateAt
});

//tabla productos
const productos = sequelize.define('productos', 
{
  id: { type: DataTypes.NUMBER, primaryKey: true},
  nombre: { type: DataTypes.STRING , allowNull: false},
  precio: { type: DataTypes.NUMBER , allowNull: false},
  idCategoria: { type: DataTypes.NUMBER , allowNull: false},
}, 
{
  timestamps: false //no crea campos createdAt ni updateAt
});

//Tabla Ordenes
const ordenes = sequelize.define('ordenes', 
{
  id: { type: DataTypes.NUMBER, primaryKey: true},
  fecha: { type: DataTypes.DATEONLY , allowNull: false},  
  total: { type: DataTypes.NUMBER , allowNull: false},  
}, 
{
  timestamps: false //no crea campos createdAt ni updateAt
});


//Tabla detalleordenes OJO QUE LE PONE LA S AL FINAL DEBE SER PLURAL SIEMPRE
const detalleordenes=sequelize.define('detalleordenes',{
  idorden: { type: DataTypes.NUMBER , primaryKey: true},
  idproducto: { type: DataTypes.NUMBER , primaryKey: true},
  cantidad: { type: DataTypes.NUMBER , allowNull: false},
  precio: { type: DataTypes.NUMBER , allowNull: false}  
},{
  timestamps: false //no crea campos createdAt ni updateAt
});

//asociaciones o relaciones entre las tablas
ordenes.hasMany(detalleordenes, {foreignKey: 'idorden'});
detalleordenes.belongsTo(ordenes, {foreignKey: 'idorden'});
productos.hasMany(detalleordenes, {foreignKey: 'idproducto'});
detalleordenes.belongsTo(productos, {foreignKey: 'idproducto'});
categorias.hasMany(productos, {foreignKey: 'idCategoria'});
productos.belongsTo(categorias, {foreignKey: 'idCategoria'});

//exporto dos objetos el objeto db.sequelize y el objeto categorias
//export default db;
export {
  sequelize, 
  categorias, 
  productos, 
  ordenes, 
  detalleordenes
}; 