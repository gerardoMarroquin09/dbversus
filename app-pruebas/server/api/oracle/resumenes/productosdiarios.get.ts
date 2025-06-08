//mostraremos la FECHA, luego el NOMBRE del producto y la cantidad de ese producto vendido en esa FECHA
//las tablas a consultar son ordenes, detalleordenes y productos
//la consulta SQL seria: 
//select ordenes.FECHA, detalleordenes.idproducto, productos.NOMBRE, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.ID = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.ID 
//group by ordenes.FECHA, detalleordenes.idproducto, productos.NOMBRE order by ordenes.FECHA
//implementamos esta consulta sql en sequelize
import { Sequelize, QueryTypes } from 'sequelize';
import { sequelize } from "../../../utils/oracle/oracle";

export default defineEventHandler(async (event) => {      
    try {
        const data = await sequelize.query(`
            SELECT 
                o.FECHA,
                do.IDPRODUCTO,
                p.NOMBRE,
                SUM(do.CANTIDAD) as total_cantidad
            FROM ORDENES o
            JOIN DETALLEORDENES do ON o.ID = do.IDORDEN
            JOIN PRODUCTOS p ON do.IDPRODUCTO = p.ID
            GROUP BY 
                o.FECHA,
                do.IDPRODUCTO,
                p.NOMBRE
            ORDER BY o.FECHA
        `, { 
            type: QueryTypes.SELECT 
        });
        
        return { 
            statusCode: 200, 
            data 
        };
    } catch (error) {
        console.error('Error productosdiarios:', error);
        return error;
    }    
});