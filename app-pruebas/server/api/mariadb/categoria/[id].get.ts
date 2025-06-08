//buscamos una categoria por su ID dicho id viene en el get
import{categorias} from "../../../utils/mariadb/mariadb";
export default defineEventHandler(async (event) => {      
    try {
        const data = await categorias.findOne({where: {id: event.context.params.id}});
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }
    
  })