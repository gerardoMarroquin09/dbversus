//agregamos una orden
import { scylladb } from "../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Consulta CQL para insertar datos en la tabla "ordenes"
    const query = `INSERT INTO ordenes (id, fecha, total) VALUES (?, ?, ?)`;

    // Ejecución de la consulta con los valores
    await scylladb.execute(query, [body.id, body.fecha, body.total], {
      prepare: true,
    });

    return { statusCode: 200, message: "insertado" };
  } catch (error) {
    console.error("Error al conectar con Scylladb en orden.post.ts:", error);
    return { statusCode: 500, message: "Error en la base de datos", error };
  }
});
