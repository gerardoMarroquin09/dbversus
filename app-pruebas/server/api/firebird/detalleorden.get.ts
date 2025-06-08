import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM DETALLEORDENES", (err, results) => {
        db.detach();
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    return {
      statusCode: 200,
      data,
    };
  } catch (error) {
    console.error("Error al obtener los detalles de orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
