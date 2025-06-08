//Endpoint para eliminar una categoria de la base de datos
import {categorias} from "../../../utils/oracle/oracle";

export default defineEventHandler(async (event) => {   
    try {
        //eliminamos de la base de datos
        const data = await categorias.destroy({
                        where: {
                            id: event.context.params.id
                        }
                    });
        return { statusCode:200, "message":"eliminado" };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })