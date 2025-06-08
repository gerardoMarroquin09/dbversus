//Endpoint para escribir una categoria de la base de datos
import {categorias} from "../../../utils/postgres/postgres";

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
  