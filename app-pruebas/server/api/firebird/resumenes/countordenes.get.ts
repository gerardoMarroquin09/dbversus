import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           FECHA, 
           COUNT(ID) AS TOTALORDENES
         FROM ORDENES
         GROUP BY FECHA
         ORDER BY FECHA ASC`,
        (err, results) => {
          db.detach();
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error al obtener las órdenes agrupadas por fecha:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
