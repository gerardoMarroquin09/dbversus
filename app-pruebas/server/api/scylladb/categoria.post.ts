import { scylladb } from "../../utils/scylladb/scylladb"; // Configuración del cliente de scylladb

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Consulta CQL para insertar datos en la tabla "categorias"
    const query = `INSERT INTO categorias (id, nombre) VALUES (?, ?)`;

    // Ejecución de la consulta con los valores
    await scylladb.execute(query, [body.id, body.nombre], { prepare: true });

    return { statusCode: 200, message: "insertado" };
  } catch (error) {
    console.error("Error al conectar con Scylladb:", error);
    return { statusCode: 500, message: "Error en la base de datos", error };
  }
});
