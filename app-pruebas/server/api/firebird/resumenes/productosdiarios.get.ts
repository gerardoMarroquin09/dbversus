import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           O.FECHA, 
           D.IDPRODUCTO, 
           P.NOMBRE, 
           SUM(D.CANTIDAD) AS TOTAL_VENDIDO
         FROM ORDENES O
         JOIN DETALLEORDENES D ON O.ID = D.IDORDEN
         JOIN PRODUCTOS P ON D.IDPRODUCTO = P.ID
         GROUP BY O.FECHA, D.IDPRODUCTO, P.NOMBRE
         ORDER BY O.FECHA`,
        (err, results) => {
          db.detach();
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error al obtener productos por fecha:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
