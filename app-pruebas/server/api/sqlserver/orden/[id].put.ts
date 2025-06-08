import { ordenesSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de orden requerido" };
        }

        // Leer el cuerpo de la solicitud
        const body = await readBody(event);
        if (!body || Object.keys(body).length === 0) {
            return { statusCode: 400, message: "Datos para actualizar requeridos" };
        }

        // Intentar actualizar la orden en SQL Server
        const resultado = await ordenesSqlServer.update(body, { where: { id } });

        // Verificar si la actualización realmente ocurrió
        if (resultado[0] === 0) {
            return { statusCode: 404, message: "Orden no encontrada o sin cambios" };
        }

        return { statusCode: 200, message: "Orden actualizada correctamente" };
    } catch (error) {
        console.error("Error al actualizar orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});