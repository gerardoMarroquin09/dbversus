import { productosSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de producto requerido" };
        }

        // Leer el cuerpo de la solicitud
        const body = await readBody(event);
        if (!body || Object.keys(body).length === 0) {
            return { statusCode: 400, message: "Datos para actualizar requeridos" };
        }

        // Intentar actualizar el producto en SQL Server
        const resultado = await productosSqlServer.update(body, { where: { id } });

        // Verificar si la actualización realmente ocurrió
        if (resultado[0] === 0) {
            return { statusCode: 404, message: "Producto no encontrado o sin cambios" };
        }

        return { statusCode: 200, message: "Producto actualizado correctamente" };
    } catch (error) {
        console.error("Error al actualizar producto en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});