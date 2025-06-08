//mostraremos la fecha, luego el nombre del producto y la cantidad de ese producto vendido en esa fecha
//las tablas a consultar son ordenes, detalleordenes y productos
//la consulta SQL seria: 
//select ordenes.fecha, detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id 
//group by ordenes.fecha, detalleordenes.idproducto, productos.nombre order by ordenes.fecha
//implementamos esta consulta sql en sequelize

import { sequelize } from '../../../utils/postgres/postgres';

export default defineEventHandler(async (event) => {
    try {
        const [result] = await sequelize.query(`
            SELECT 
                o.fecha, 
                d.idproducto, 
                p.nombre, 
                SUM(d.cantidad) AS cantidad_total
            FROM ordenes o
            JOIN detalleordenes d ON o.id = d.idorden
            JOIN productos p ON d.idproducto = p.id
            GROUP BY o.fecha, d.idproducto, p.nombre
            ORDER BY o.fecha
        `);

        return { statusCode: 200, data: result };
    } catch (error) {
        console.error("Error productosdiarios:", error);
        return { statusCode: 500, error: "Error al obtener productos diarios" };
    }
});
