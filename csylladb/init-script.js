const cassandra = require("cassandra-driver")

const client = new cassandra.Client({
  contactPoints: [process.env.SCYLLA_HOST || "scylla"],
  localDataCenter: "datacenter1",
})

async function initializeDatabase() {
  try {
    // Crear keyspace
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS cafeteria
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    `)

    // Usar keyspace
    await client.execute("USE cafeteria")

    // Crear tablas
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id uuid PRIMARY KEY,
        nombre text
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id uuid PRIMARY KEY,
        nombre text,
        precio decimal,
        idCategoria uuid
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS ordenes (
        id uuid PRIMARY KEY,
        fecha timestamp,
        total decimal,
        productos list<frozen<map<text, text>>>
      )
    `)

    console.log("Base de datos inicializada correctamente")
    process.exit(0)
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err)
    process.exit(1)
  }
}

initializeDatabase()
