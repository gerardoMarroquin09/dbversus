import { detalleordenes} from "../../../utils/mariadb/mariadb";
export default defineEventHandler(async (event) => {   
    try {
        //eliminamos de la base de datos
        const data = await detalleordenes.destroy({
                        where: {
                            idorden: event.context.params.idorden
                        }
                    });
        return { statusCode:200, "message":"eliminado" };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })