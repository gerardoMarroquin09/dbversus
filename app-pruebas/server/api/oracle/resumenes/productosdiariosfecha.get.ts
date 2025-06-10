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
///api/oracle/resumenes/productosdiariosfecha?fecha=2024-01-02

import { QueryTypes } from "sequelize"
import { sequelize } from "../../../utils/oracle/oracle"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let fecha = query.fecha || query.FECHA

  if (!fecha) {
    return { statusCode: 400, error: "Falta el parámetro 'fecha'" }
  }

  // Recorta todo después de la 'T' para quedarte solo con la parte de la fecha
  if (fecha.includes("T")) {
    fecha = fecha.split("T")[0]
  }

  try {
    const data = await sequelize.query(
      `
      SELECT 
        o.FECHA,
        do.IDPRODUCTO,
        p.NOMBRE,
        SUM(do.CANTIDAD) AS cantidad
      FROM ORDENES o
      JOIN DETALLEORDENES do ON o.ID = do.IDORDEN
      JOIN PRODUCTOS p ON do.IDPRODUCTO = p.ID
      WHERE TRUNC(o.FECHA) = TO_DATE(:fecha, 'YYYY-MM-DD')
      GROUP BY o.FECHA, do.IDPRODUCTO, p.NOMBRE
      ORDER BY o.FECHA
    `,
      {
        replacements: { fecha },
        type: QueryTypes.SELECT,
      }
    )

    return {
      statusCode: 200,
      data,
    }
  } catch (error) {
    console.error("Error productosdiariosfecha:", error)
    return {
      statusCode: 500,
      error: error.message,
    }
  }
})
