// Obtiene todos los productos de la base de datos scylladb
import { scylladb } from "../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  try {
    // Consulta CQL para obtener todas las categorías
    const query = "SELECT * FROM productos";
    const result = await scylladb.execute(query);

    // Retorna las filas obtenidas de scylladb
    return result.rows;
  } catch (error) {
    console.error("❌ Error al obtener los productos:", error);
    return { statusCode: 500, message: "Error al obtener los productos" };
  }
});
