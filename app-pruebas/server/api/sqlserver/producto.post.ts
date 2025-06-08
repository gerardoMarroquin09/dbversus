import { productosSqlServer } from "../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Leer el cuerpo de la solicitud
        const body = await readBody(event);

        // Validar que todos los campos requeridos estén presentes
        if (!body.id || !body.nombre || !body.precio || body.precio < 0 || !body.idCategoria) {
            return { statusCode: 400, message: "Faltan campos requeridos" };
        }

        // Insertar el producto en SQL Server
        const data = await productosSqlServer.create({
            id: body.id,
            nombre: body.nombre,
            precio: body.precio,
            idCategoria: body.idCategoria
        });

        return { statusCode: 200, message: "Producto insertado correctamente", data };
    } catch (error) {
        console.error("Error al insertar producto en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});