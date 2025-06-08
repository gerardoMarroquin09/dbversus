import { scylladb } from "../../../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  const idorden = event.context.params?.idorden;
  const idproducto = event.context.params?.idproducto;
  try {
    //actualizamos el detalle orden con el id de la orden y el id del producto
    const body = await readBody(event);
    const data = await scylladb.execute(
      `UPDATE detalleordenes SET cantidad = ?, precio = ? WHERE idorden = ? AND idproducto = ?`,
      [body.cantidad, body.precio, idorden, idproducto],
      { prepare: true }
    );
    return { statusCode: 200, data };
  } catch (error) {
    console.error("❌ Error al actualizar en scylladb:", error);
    return {
      statusCode: 500,
      message: "Error al actualizar",
    };
  }
});
