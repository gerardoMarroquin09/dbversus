//se va actualizar los productos con el id que viene en el get y el json de la data
import {productos} from "../../../utils/mariadb/mariadb";
export default defineEventHandler(async (event) => {  
    try {
      const body = await readBody(event);
        const data = await productos.update(body, {where: {id: event.context.params.id}});
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })