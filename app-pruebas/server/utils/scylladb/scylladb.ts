import { Client } from "cassandra-driver"

// Variable de entorno para la IP o nombre del servidor de scylladb
let hostdb = process.env.HOST_DB || "scylla_container"

// Configuración del cliente de scylladb
const scylladb = new Client({
  contactPoints: [hostdb], // Dirección del servidor
  localDataCenter: "datacenter1",
  keyspace: "cafeteria",
  socketOptions: {
    readTimeout: 10000, // Aumentamos el timeout para desarrollo
  },
  protocolOptions: {
    port: 9042, // Puerto por defecto de ScyllaDB
  },
})
// Verificar conexión
scylladb
  .connect()
  .then(() => console.log("✅ Conectado a Scylladb en Docker"))
  .catch((err) => console.error("❌ Error al conectar con scylladb:", err))

// Definición de las tablas con sus columnas
const categoriasTable = "categorias"
const productosTable = "productos"
const ordenesTable = "ordenes"
const detalleOrdenesTable = "detalleordenes"

// Función para crear las tablas en scylladb (Si no existen)
const createTables = async () => {
  try {
    await scylladb.execute(`
      CREATE TABLE IF NOT EXISTS ${categoriasTable} (
        id UUID PRIMARY KEY,
        nombre TEXT
      )
    `)

    await scylladb.execute(`
      CREATE TABLE IF NOT EXISTS ${productosTable} (
        id UUID PRIMARY KEY,
        nombre TEXT,
        precio DECIMAL,
        idCategoria UUID
      )
    `)

    await scylladb.execute(`
      CREATE TABLE IF NOT EXISTS ${ordenesTable} (
        id UUID PRIMARY KEY,
        fecha TIMESTAMP,
        total DECIMAL
      )
    `)

    await scylladb.execute(`
      CREATE TABLE IF NOT EXISTS ${detalleOrdenesTable} (
        idorden UUID,
        idproducto UUID,
        cantidad INT,
        precio DECIMAL,
        PRIMARY KEY (idorden, idproducto)
      )
    `)

    console.log("Tablas creadas/verificadas en scylladb.")
  } catch (error) {
    console.error("Error al crear/verificar tablas en scylladb:", error)
  }
}

// Llamamos a la función de creación de tablas al inicio
createTables()

// Exportamos el cliente y los nombres de las tablas
export {
  categoriasTable,
  detalleOrdenesTable,
  ordenesTable,
  productosTable,
  scylladb,
}
