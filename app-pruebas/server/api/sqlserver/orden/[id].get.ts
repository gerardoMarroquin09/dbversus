import { ordenesSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de orden requerido" };
        }

        // Buscar la orden en SQL Server
        const data = await ordenesSqlServer.findByPk(id);

        if (!data) {
            return { statusCode: 404, message: "Orden no encontrada" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});