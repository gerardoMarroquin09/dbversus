//Devolveremos las fechas y la suma de las ordenes en esas fechas
//ordenando por la fecha
import { ordenes } from "../../../utils/postgres/postgres";
export default defineEventHandler(async (event) => {      
    try {
        const data = await ordenes.findAll({
            attributes: [[sequelize.fn('date', sequelize.col('fecha')), 'fecha'], [sequelize.fn('sum', sequelize.col('total')), 'total']],
            group: 'fecha',
            order: [[sequelize.fn('date', sequelize.col('fecha')), 'ASC']],
            raw: true
        });
        return { statusCode:200, data };
         
      } catch (error) {
        console.error('Error totaldiario:', error);
        return(error)
      }    
})