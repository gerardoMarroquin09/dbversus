//este end poin ejecuta la siguiente consulta sql para obtener el top ten 
// de productos vendidos
//select detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id 
//group by productos.id, productos.nombre 
//order by 3 desc
//limit 10

import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           D.IDPRODUCTO, 
           P.NOMBRE, 
           SUM(D.CANTIDAD) AS CANTIDAD 
         FROM DETALLEORDENES D 
         JOIN PRODUCTOS P ON D.IDPRODUCTO = P.ID 
         GROUP BY D.IDPRODUCTO, P.NOMBRE 
         ORDER BY CANTIDAD DESC 
         ROWS 10`,
        (err, results) => {
          db.detach();
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error al obtener el top 10 de productos:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
