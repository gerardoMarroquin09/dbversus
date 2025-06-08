import { categoriasSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié la importación a SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro ID está disponible
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de categoría requerido" };
        }

        // Leer el cuerpo de la solicitud
        const body = await readBody(event);
        if (!body || Object.keys(body).length === 0) {
            return { statusCode: 400, message: "Datos para actualizar requeridos" };
        }

        // Intentar actualizar la categoría en SQL Server
        const resultado = await categoriasSqlServer.update(body, { where: { id: id } });

        // Verificar si la categoría realmente se actualizó
        if (resultado[0] === 0) {
            return { statusCode: 404, message: "Categoría no encontrada o sin cambios" };
        }

        return { statusCode: 200, message: "Categoría actualizada correctamente" };
    } catch (error) {
        console.error("Error al actualizar categoría en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});
  