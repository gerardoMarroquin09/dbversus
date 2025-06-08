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
//http://localhost:3000/api/mysql/resumenes/productosdiariosfecha?fecha=2024-01-02

import { sequelize } from '../../../utils/postgres/postgres';

export default defineEventHandler(async (event) => {
    const { fecha } = getQuery(event);
    
    if (!fecha) {
        return { statusCode: 400, error: "Falta el parámetro 'fecha'" };
    }

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
            WHERE o.fecha = :fecha
            GROUP BY o.fecha, d.idproducto, p.nombre
            ORDER BY o.fecha
        `, {
            replacements: { fecha }
        });

        console.log("Resumen de productos por fecha:", result);
        return { statusCode: 200, data: result };
    } catch (error) {
        console.error('Error productosdiariosfecha:', error);
        return { statusCode: 500, error: 'Error interno del servidor' };
    }
});
