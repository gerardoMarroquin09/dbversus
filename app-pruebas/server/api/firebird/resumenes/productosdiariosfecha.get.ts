//mostraremos la fecha, luego el nombre del producto y la cantidad de ese producto vendido en esa fecha
//las tablas a consultar son ordenes, detalleordenes y productos
//la consulta SQL seria: 
//select ordenes.fecha, detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id 
//where ordenes.fecha = '2021-09-01'
//group by ordenes.fecha, detalleordenes.idproducto, productos.nombre order by ordenes.fecha
//implementamos esta consulta sql en sequelize y el filtro por fecha se pasa como parametro

// SE DEBE INVOCAR ASI
//http://localhost:3000/api/mysql/resumenes/productosdiariosfecha?fecha=2024-04-06

import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  const { fecha } = getQuery(event);

  if (!fecha) {
    return { statusCode: 400, message: "La fecha es obligatoria" };
  }

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
         WHERE O.FECHA = ?
         GROUP BY O.FECHA, D.IDPRODUCTO, P.NOMBRE
         ORDER BY O.FECHA`,
        [fecha],
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
