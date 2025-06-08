//agregamos una orden
import { ordenes } from "../../utils/postgres/postgres";

//importamos fecha de sequelize types
import { DataTypes } from 'sequelize';

export default defineEventHandler(async (event) => {
    //console.log("entro a orden.post")    
    const body = await readBody(event);
    //console.log(body)
    try {

        //valido que en el body vengan todos los campos requeridos
        if (!body.id || !body.fecha || !body.total || body.total < 0 ) {
            return { statusCode: 400, "message": "Faltan campos requeridos" };
        }
        //console.log(body) 
        //la fecha viene en string anho,mes,dia
        //la convierto a un objeto Date
        //console.log(body.fecha)
        let [anho,mes,dia] = body.fecha.split(",");
        // en new Date de javascript el mes es de 0 a 11
        let lfecha = new Date(anho,mes-1,dia,0,0,0,0);
        //console.log(lfecha)
        
        //AQUI TENGO EL ERROR problema de fecha
        await ordenes.create({
            id: body.id,
            fecha: lfecha,            
            total: body.total
        });       
        
        return { statusCode: 200, "message": "insertado" };
    } catch (error) {
        console.error('Ocurrio un error:', error);
        return (error);
    }
})