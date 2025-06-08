//obtenemos todas las categorias de la base de datos
import {categorias} from "../../utils/postgres/postgres";

export default defineEventHandler(async (event) => {      
    try {        
        const data = await categorias.findAll();
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })
