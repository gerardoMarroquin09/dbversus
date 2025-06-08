import { ordenesSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de orden requerido" };
        }

        // Intentar eliminar la orden en SQL Server
        const resultado = await ordenesSqlServer.destroy({
            where: { id }
        });

        // Verificar si la eliminación realmente ocurrió
        if (resultado === 0) {
            return { statusCode: 404, message: "Orden no encontrada" };
        }

        return { statusCode: 200, message: "Orden eliminada correctamente" };
    } catch (error) {
        console.error("Error al eliminar orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});