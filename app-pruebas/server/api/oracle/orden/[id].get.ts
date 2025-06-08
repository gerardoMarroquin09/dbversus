import {ordenes} from '../../../utils/oracle/oracle';
export default defineEventHandler(async (event) => {   
    try {
        //obtenemos la orden con el id que viene en la url
        const data = await ordenes.findByPk(event.context.params.id);
        return { statusCode:200, data };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })