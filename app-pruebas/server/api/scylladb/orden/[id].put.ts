import { scylladb } from "../../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  try {
    //actualizamos la orden con el id que viene en la url
    const body = await readBody(event);
    const id = event.context.params?.id;

    // Consulta CQL para actualizar una orden por su ID (asumimos que id es UUID)
    const query = `
      UPDATE ordenes
      SET fecha = ?, total = ?
      WHERE id = ?;
    `;
    // Ejecutamos la consulta pasando el valor del id
    await scylladb.execute(query, [body.fecha, body.total, id], {
      prepare: true,
    });

    return { statusCode: 200, message: "Orden actualizada exitosamente" };
  } catch (error) {
    console.error("❌ Error al actualizar la orden:", error);
    return { statusCode: 500, message: "Error al actualizar la orden" };
  }
});
