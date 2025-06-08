import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { idorden, idproducto } = body;

    // Validación de datos
    if (idorden === undefined || idproducto === undefined) {
      return {
        statusCode: 400,
        message: "idorden y idproducto son obligatorios para eliminar el detalle",
      };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM DETALLEORDENES WHERE IDORDEN = ? AND IDPRODUCTO = ?",
        [idorden, idproducto],
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
      message: "Detalle de orden eliminado correctamente",
      data: { idorden, idproducto },
    };
  } catch (error) {
    console.error("Error al eliminar el detalle de orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
