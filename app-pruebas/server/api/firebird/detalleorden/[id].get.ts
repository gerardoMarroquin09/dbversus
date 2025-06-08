import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const idorden = Number(event.context.params.id); // ahora sí correcto
    if (isNaN(idorden)) {
      return { statusCode: 400, message: "ID de orden inválido" };
    }

    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM DETALLEORDENES WHERE IDORDEN = ?",
        [idorden],
        (err, results) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve(results.length > 0 ? results : null);
          }
        }
      );
    });

    if (!data) {
      return { statusCode: 404, message: "No se encontraron detalles para esta orden" };
    }

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error al obtener el detalle de la orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
