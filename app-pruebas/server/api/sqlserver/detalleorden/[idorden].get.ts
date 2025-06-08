import { detalleordenesSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

// Endpoint para obtener todos los detalles de la orden según su ID
export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro existe antes de acceder a él
        const idorden = event.context.params?.idorden;
        if (!idorden) {
            return { statusCode: 400, message: "ID de orden requerido" };
        }

        // Obtener los detalles de la orden en SQL Server
        const data = await detalleordenesSqlServer.findAll({
            where: { idorden }
        });

        if (!data || data.length === 0) {
            return { statusCode: 404, message: "No se encontraron detalles para esta orden" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar detalles de orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});