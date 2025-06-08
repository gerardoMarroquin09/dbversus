//buscamos una categoria por su ID dicho id viene en el get
import { scylladb } from "../../../utils/scylladb/scylladb";
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    // Consulta CQL para obtener una categoría por su ID (asumimos que id es UUID)
    const query = "SELECT * FROM categorias WHERE id = ?";

    // Ejecutamos la consulta pasando el valor del id
    const result = await scylladb.execute(query, [id], { prepare: true });

    // Verificamos si se encontró la categoría
    if (result.rowLength === 0) {
      return { statusCode: 404, message: "Categoría no encontrada" };
    }

    // Retorna la primera fila (solo habrá una, ya que estamos buscando por clave primaria)
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al obtener la categoría:", error);
    return { statusCode: 500, message: "Error al obtener la categoría" };
  }
});
