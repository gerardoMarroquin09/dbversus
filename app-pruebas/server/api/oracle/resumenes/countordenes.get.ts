//devolvemos la fecha y el total de ordenes que se han hecho en esa fecha, ordenado por fecha
import { ordenes } from "../../../utils/oracle/oracle";
export default defineEventHandler(async (event) => {      
    try {
        const data = await ordenes.findAll({
            attributes: [[sequelize.fn('TRUNC', sequelize.col('FECHA')), 'FECHA'], [sequelize.fn('COUNT', sequelize.col('ID')), 'totalOrdenes']],
            group: 'FECHA',
            order: [[sequelize.fn('TRUNC', sequelize.col('FECHA')), 'ASC']],
            raw: true
        });
        return { statusCode:200, data };
        } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
        }
    })
