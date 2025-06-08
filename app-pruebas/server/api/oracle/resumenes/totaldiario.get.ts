//Devolveremos las fechas y la suma de las ordenes en esas fechas
//ordenando por la fecha
import { ordenes } from "../../../utils/oracle/oracle";
export default defineEventHandler(async (event) => {      
    try {
        const data = await ordenes.findAll({
            attributes: [[sequelize.fn('TRUNC', sequelize.col('FECHA')), 'FECHA'], [sequelize.fn('SUM', sequelize.col('TOTAL')), 'TOTAL']],
            group: 'FECHA',
            order: [[sequelize.fn('TRUNC', sequelize.col('FECHA')), 'ASC']],
            raw: true
        });
        return { statusCode:200, data };
         
      } catch (error) {
        console.error('Error totaldiario:', error);
        return(error)
      }    
})