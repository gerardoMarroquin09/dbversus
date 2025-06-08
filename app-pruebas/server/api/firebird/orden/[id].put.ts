import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const body = await readBody(event);
    const { fecha, total } = body;

    if (!id || !fecha || total == null) {
      return { statusCode: 400, message: "ID, fecha y total son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE ORDENES SET FECHA = ?, TOTAL = ? WHERE ID = ?",
        [fecha, total, id],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve({ message: `Orden con ID ${id} actualizada` });
          }
        }
      );
    });

    return {
      statusCode: 200,
      message: "Orden actualizada correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
