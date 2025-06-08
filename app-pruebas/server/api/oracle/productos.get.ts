import {productos} from "../../utils/oracle/oracle";
export default defineEventHandler(async (event) => {      
    try {        
        const data = await productos.findAll();
        return data;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })
