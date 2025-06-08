import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, nombre, precio, idCategoria } = body;

    if (!id || !nombre || precio == null || !idCategoria) {
      return { statusCode: 400, message: "Todos los campos son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO PRODUCTOS (ID, NOMBRE, PRECIO, IDCATEGORIA) VALUES (?, ?, ?, ?)",
        [id, nombre, precio, idCategoria],
        (err, res) => {
          db.detach();
          if (err) reject(err);
          else resolve({ id, nombre, precio, idCategoria });
        }
      );
    });

    return {
      statusCode: 201,
      message: "Producto insertado correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al insertar el producto:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
