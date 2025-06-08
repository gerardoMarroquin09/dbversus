import {categorias} from "../../utils/mariadb/mariadb";

export default defineEventHandler(async (event) => {      
    try {        
        const data = await categorias.findAll();
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
})
