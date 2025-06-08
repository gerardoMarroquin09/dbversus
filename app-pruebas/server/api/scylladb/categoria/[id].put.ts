//se va actualizar la categoria con el id que viene en el get y el json de la data
import { scylladb } from "../../../utils/scylladb/scylladb";
export default defineEventHandler(async (event) => {
  try {
    // Leer el cuerpo de la solicitud (los datos de la categoría)
    const body = await readBody(event);

    // Obtener el UUID del parámetro de la URL (el UUID de la categoría a actualizar)
    const categoryId = event.context.params?.id; // Este es el UUID

    // Generar la consulta CQL para actualizar la categoría
    const query = `
      UPDATE categorias 
      SET nombre = ? 
      WHERE id = ?;
    `;

    // Ejecutar la consulta en scylladb
    await scylladb.execute(query, [body.nombre, categoryId], {
      prepare: true,
    });

    return { statusCode: 200, message: "Categoría actualizada exitosamente" };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return {
      statusCode: 500,
      message: "Error al actualizar la categoría",
      error,
    };
  }
});
