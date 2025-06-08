import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const body = await readBody(event);
    const { nombre, precio, idCategoria } = body;

    if (!id || !nombre || precio == null || !idCategoria) {
      return { statusCode: 400, message: "Todos los campos son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE PRODUCTOS SET NOMBRE = ?, PRECIO = ?, IDCATEGORIA = ? WHERE ID = ?",
        [nombre, precio, idCategoria, id],
        (err, res) => {
          db.detach();
          if (err) reject(err);
          else resolve({ message: `Producto con ID ${id} actualizado` });
        }
      );
    });

    return {
      statusCode: 200,
      message: "Producto actualizado correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
