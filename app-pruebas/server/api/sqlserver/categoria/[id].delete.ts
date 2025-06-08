import { categoriasSqlServer } from "../../../utils/sqlserver/sqlserver";

export default defineEventHandler(async (event) => {
    try {
        // Verificar si los parámetros existen
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de categoría requerido" };
        }

        // Intentar eliminar la categoría en SQL Server
        const resultado = await categoriasSqlServer.destroy({
            where: { id: id }
        });

        // Verificar si la categoría realmente se eliminó
        if (resultado === 0) {
            return { statusCode: 404, message: "Categoría no encontrada" };
        }

        return { statusCode: 200, message: "Categoría eliminada correctamente" };
    } catch (error) {
        console.error("Error al eliminar categoría en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});