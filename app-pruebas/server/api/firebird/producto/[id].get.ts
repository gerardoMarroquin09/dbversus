import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);
    if (isNaN(id)) {
      return { statusCode: 400, message: "ID inválido" };
    }

    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM PRODUCTOS WHERE ID = ?", [id], (err, results) => {
        db.detach();
        if (err) reject(err);
        else resolve(results.length > 0 ? results[0] : null);
      });
    });

    if (!data) {
      return { statusCode: 404, message: "Producto no encontrado" };
    }

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
