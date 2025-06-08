import { categoriasSqlServer } from "../../utils/sqlserver/sqlserver"; // Migración de MySQL a SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Consultar todas las categorías en SQL Server
        const data = await categoriasSqlServer.findAll();

        if (!data.length) {
            return { statusCode: 404, message: "No se encontraron categorías en la base de datos" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar categorías en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});