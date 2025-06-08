import { detalleordenes } from "../../../utils/postgres/postgres";
//Endpoint donde obtenemos todos los detalle orden seguin el id de la orden
export default defineEventHandler(async (event) => {     
    try {        
        const data = await detalleordenes.findAll({
                        where: {
                            idorden: event.context.params.idorden
                        }
                    });
        return { statusCode:200, data };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })