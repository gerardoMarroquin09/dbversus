//Devolveremos las fechas y la suma de las ordenes en esas fechas
//ordenando por la fecha
import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           FECHA, 
           SUM(TOTAL) AS TOTAL 
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
    console.error("Error totaldiario:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
