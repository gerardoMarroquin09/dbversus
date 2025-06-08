//este end poin ejecuta la siguiente consulta sql para obtener el top ten 
// de productos vendidos
//select detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad) 
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id 
//group by productos.id, productos.nombre 
//order by 3 desc
//limit 10

import { ordenes, detalleordenes, productos } from "../../../utils/postgres/postgres";
export default defineEventHandler(async (event) => {   
    try {               
        const data = await detalleordenes.findAll({
            attributes: ['idproducto', [sequelize.fn('sum', sequelize.col('cantidad')), 'cantidad']],
            include: [
                {
                    model: productos,
                    attributes: ['nombre'],
                }
            ],
            group: ['detalleordenes.idproducto', 'producto.id', 'producto.nombre'],
            order: [[sequelize.fn('sum', sequelize.col('cantidad')), 'DESC']],
            limit: 10
        });
        return { statusCode:200, data };
    } catch (error) {
        console.error('Error topten:', error);
        return(error)
    }    
})