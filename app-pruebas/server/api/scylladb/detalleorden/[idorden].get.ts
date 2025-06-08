import { scylladb } from "../../../utils/scylladb/scylladb";
//Endpoint donde obtenemos todos los detalle orden seguin el id de la orden
export default defineEventHandler(async (event) => {
  try {
    //obtenemos la orden con el id que viene en la url
    const id = event.context.params?.idorden;
    // Verificamos si se proporcionó un ID
    if (!id) {
      return { statusCode: 400, message: "ID de orden no proporcionado" };
    }
    // Consulta CQL para obtener una orden por su ID (asumimos que id es UUID)
    const query = "SELECT * FROM detalleordenes WHERE idorden = ?";

    // Ejecutamos la consulta pasando el valor del id
    const result = await scylladb.execute(query, [id], { prepare: true });
    // Verificamos si se encontró la orden
    if (result.rowLength === 0) {
      return { statusCode: 404, message: "Orden no encontrada" };
    }
    // Retorna la primera fila (solo habrá una, ya que estamos buscando por clave primaria)
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al obtener la orden de detalle orden: x", error);
    return { statusCode: 500, message: "Error al obtener la orden" };
  }
});
