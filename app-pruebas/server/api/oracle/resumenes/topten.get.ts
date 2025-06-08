//este end poin ejecuta la siguiente consulta sql para obtener el top ten 
// de productos vendidos
//select detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id 
//group by productos.id, productos.nombre 
//order by 3 desc
//limit 10

import { Sequelize, QueryTypes } from 'sequelize';
import { sequelize, ordenes, detalleordenes, productos } from "../../../utils/oracle/oracle";

export default defineEventHandler(async (event) => {
    try {
        const data = await sequelize.query(`
      SELECT * FROM (
        SELECT detalleordenes.idproducto, productos.nombre, SUM(detalleordenes.cantidad) AS cantidad
        FROM ordenes
        JOIN detalleordenes ON ordenes.id = detalleordenes.idorden
        JOIN productos ON detalleordenes.idproducto = productos.id
        GROUP BY detalleordenes.idproducto, productos.nombre
        ORDER BY cantidad DESC
      ) WHERE ROWNUM <= 10
      `,
            {
                type: QueryTypes.SELECT,
                logging: console.log
            });
        return { statusCode: 200, data };
    } catch (error) {
        console.error('Error topten:', error);
        return error;
    }
});