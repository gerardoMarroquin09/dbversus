//obtenemos todas las categorias de la base de datos
import { scylladb } from "../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  try {
    // Consulta CQL para obtener todas las categorías
    const query = "SELECT * FROM categorias";
    const result = await scylladb.execute(query);

    // Retorna las filas obtenidas de Scylladb
    return result.rows;
  } catch (error) {
    console.error("❌ Error al obtener las categorías:", error);
    return { statusCode: 500, message: "Error al obtener las categorías" };
  }
});
