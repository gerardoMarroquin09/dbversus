import { categorias } from "../../../utils/postgres/postgres";

export default defineEventHandler(async (event) => {      
    try {
        console.log("Params:", event.context.params);  // Agrega esto
        
        const id = parseInt(event.context.params.id);  
        const data = await categorias.findOne({
          where: { id: id },
          searchPath: 'cafeteria'
        });
        return data;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error;
    }
})