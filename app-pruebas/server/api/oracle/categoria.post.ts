
import {categorias} from "../../utils/oracle/oracle";

export default defineEventHandler(async (event) => {
    // imprimimos en consola la data que recibimos
    const body = await readBody(event);
    //console.log(body)
    
    try {
        //ahora guardo en la base de datos
        //await db.sequelize.authenticate();
        const data = await categorias.create({
                        id: body.id,
                        nombre: body.nombre,
                        });
        return { statusCode:200, "message":"insertado" };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })