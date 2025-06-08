//buscamos un producto por su ID dicho id viene en el get
import {productos} from "../../../utils/postgres/postgres";
export default defineEventHandler(async (event) => {      
    try {
        const data = await productos.findOne({where: {id: event.context.params.id}});
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })
