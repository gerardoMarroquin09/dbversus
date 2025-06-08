
import {productos} from "../../utils/mariadb/mariadb";

export default defineEventHandler(async (event) => {
    // imprimimos en consola la data que recibimos
    const body = await readBody(event);
    //console.log(body)    
    try {
        //valido que en el body vengan todos los campos requeridos        
        if (!body.id || !body.nombre || !body.precio || body.precio<0  || !body.idCategoria) {
          //console.log("Faltan campos requeridos")  
          return { statusCode:400, "message":"Faltan campos requeridos" };
        }
        //ahora guardo en la base de datos
        //await db.sequelize.authenticate();
        const data = await productos.create({
                        id: body.id,
                        nombre: body.nombre,
                        precio: body.precio,
                        idCategoria: body.idCategoria,
                        });
        return { statusCode:200, "message":"insertado" };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return(error)
      }    
  })
