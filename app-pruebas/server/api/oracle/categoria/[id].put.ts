//se va actualizar la categoria con el id que viene en el get y el json de la data
import {categorias} from "../../../utils/oracle/oracle";
export default defineEventHandler(async (event) => {  
    try {
      const body = await readBody(event);
        const data = await categorias.update(body, {where: {id: event.context.params.id}});
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })
  