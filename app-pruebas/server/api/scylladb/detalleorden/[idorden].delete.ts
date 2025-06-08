import { scylladb } from "../../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  try {
    //eliminamos de la base de datos
    const id = event.context.params?.idorden;
    const query = "DELETE FROM detalleordenes WHERE idorden = ?";
    await scylladb.execute(query, [id], { prepare: true });
    return { statusCode: 200, message: "Eliminado correctamente" };
  } catch (error) {
    console.error("❌ Error al eliminar en scylladb:", error);
    return {
      statusCode: 500,
      message: "Error al eliminar",
    };
  }
});
