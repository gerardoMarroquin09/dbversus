import{ordenes} from "../../../utils/postgres/postgres";
export default defineEventHandler(async (event) => {   
    try {
        //eliminamos de la base de datos
        const data = await ordenes.destroy({
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