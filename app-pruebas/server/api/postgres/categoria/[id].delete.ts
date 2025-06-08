import { categorias } from "../../../utils/postgres/postgres";

export default defineEventHandler(async (event) => {      
  try {
    console.log('Params:', event.context.params); // 👈 LOG
    
    const id = parseInt(event.context.params.id);
    
    if (isNaN(id)) {
      throw new Error('Invalid ID parameter');
    }
    
    await categorias.destroy({
      where: { id: id },
      searchPath: 'cafeteria'
    });

    return { message: "Deleted successfully" };
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
});
