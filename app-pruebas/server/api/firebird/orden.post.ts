import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { id, fecha, total } = body;

    if (!id || !fecha || total == null) {
      return { statusCode: 400, message: "ID, fecha y total son obligatorios" };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO ORDENES (ID, FECHA, TOTAL) VALUES (?, ?, ?)",
        [id, fecha, total],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve({ id, fecha, total });
          }
        }
      );
    });

    return {
      statusCode: 201,
      message: "Orden insertada correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al insertar la orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
