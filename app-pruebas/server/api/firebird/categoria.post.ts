import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { id, nombre } = body;

    if (!id || !nombre) {
      return { statusCode: 400, message: "ID y nombre son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO CATEGORIAS (ID, NOMBRE) VALUES (?, ?)",
        [id, nombre],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve({ id, nombre });
          }
        }
      );
    });

    return {
      statusCode: 201,
      message: "Categoría insertada correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al insertar la categoría:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
