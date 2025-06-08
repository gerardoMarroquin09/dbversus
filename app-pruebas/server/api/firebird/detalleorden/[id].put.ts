import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { idorden, idproducto, cantidad, precio } = body;

    // Validar campos
    if (
      idorden === undefined ||
      idproducto === undefined ||
      cantidad === undefined ||
      precio === undefined
    ) {
      return {
        statusCode: 400,
        message: "Todos los campos (idorden, idproducto, cantidad, precio) son obligatorios",
      };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE DETALLEORDENES SET CANTIDAD = ?, PRECIO = ? WHERE IDORDEN = ? AND IDPRODUCTO = ?",
        [cantidad, precio, idorden, idproducto],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return {
      statusCode: 200,
      message: "Detalle de orden actualizado correctamente",
      data: { idorden, idproducto, cantidad, precio },
    };
  } catch (error) {
    console.error("Error al actualizar el detalle de orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
