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
//http://localhost:3000/api/mariadb/resumenes/productosdiariosfecha?fecha=2024-01-02

import { ordenes, detalleordenes, productos } from "../../../utils/mariadb/mariadb";
export default defineEventHandler(async (event) => {   
    
    //return { statusCode:200, "hola": getQuery(event) };
    const { fecha } = getQuery(event);
    try {               
        const data = await ordenes.findAll({
            attributes: ['fecha'],
            include: [
                {
                    model: detalleordenes,
                    attributes: ['cantidad'],
                    include: [
                        {
                            model: productos,
                            attributes: ['id','nombre'],
                        }
                    ]
                }
            ],
            where: { fecha: fecha },            
            group: ['fecha','id', 'detalleordenes.idproducto', 'nombre'],
            order: ['fecha']
        });
        return { statusCode:200, data };
    } catch (error) {
        console.error('Error productosdiarios:', error);
        return(error)
    }    
})

