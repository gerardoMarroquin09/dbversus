import { categoriasSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié la importación para SQL Server

export default defineEventHandler(async (event) => {      
    try {
        // Validar si `params` existe antes de acceder al `id`
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de categoría requerido" };
        }

        // Buscar la categoría en SQL Server
        const data = await categoriasSqlServer.findOne({
            where: { id: id }
        });

        if (!data) {
            return { statusCode: 404, message: "Categoría no encontrada" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al buscar categoría en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});