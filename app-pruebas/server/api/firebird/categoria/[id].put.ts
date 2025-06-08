import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const body = await readBody(event);
    const { nombre } = body;

    if (!id || !nombre) {
      return { statusCode: 400, message: "ID y nombre son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE CATEGORIAS SET NOMBRE = ? WHERE ID = ?",
        [nombre, id],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve({ message: `Categoría con ID ${id} actualizada` });
          }
        }
      );
    });

    return {
      statusCode: 200,
      message: "Categoría actualizada correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});

