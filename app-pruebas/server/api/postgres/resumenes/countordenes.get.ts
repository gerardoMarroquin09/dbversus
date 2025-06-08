//devolvemos la fecha y el total de ordenes que se han hecho en esa fecha, ordenado por fecha
import { ordenes } from "../../../utils/postgres/postgres";
export default defineEventHandler(async (event) => {      
    try {
        const data = await ordenes.findAll({
            attributes: [[sequelize.fn('date', sequelize.col('fecha')), 'fecha'], [sequelize.fn('count', sequelize.col('id')), 'totalOrdenes']],
            group: 'fecha',
            order: [[sequelize.fn('date', sequelize.col('fecha')), 'ASC']],
            raw: true
        });
        return { statusCode:200, data };
        } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
        }
    })
