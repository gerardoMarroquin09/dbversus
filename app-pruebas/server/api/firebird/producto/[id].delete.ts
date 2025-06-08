import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;

    if (!id) {
      return { statusCode: 400, message: "ID es obligatorio" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query("DELETE FROM PRODUCTOS WHERE ID = ?", [id], (err, res) => {
        db.detach();
        if (err) reject(err);
        else resolve({ message: `Producto con ID ${id} eliminado` });
      });
    });

    return {
      statusCode: 200,
      message: "Producto eliminado correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
