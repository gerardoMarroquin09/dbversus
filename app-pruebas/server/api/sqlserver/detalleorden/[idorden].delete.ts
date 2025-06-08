import { detalleordenesSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro existe antes de acceder a él
        const idorden = event.context.params?.idorden;
        if (!idorden) {
            return { statusCode: 400, message: "ID de orden requerido" };
        }

        // Intentar eliminar el detalle de la orden en SQL Server
        const resultado = await detalleordenesSqlServer.destroy({
            where: { idorden }
        });

        // Verificar si la eliminación realmente ocurrió
        if (resultado === 0) {
            return { statusCode: 404, message: "Detalle de orden no encontrado" };
        }

        return { statusCode: 200, message: "Detalle de orden eliminado correctamente" };
    } catch (error) {
        console.error("Error al eliminar detalle de orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});