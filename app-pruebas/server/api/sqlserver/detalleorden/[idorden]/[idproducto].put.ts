import { detalleordenesSqlServer } from "../../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si los parámetros existen antes de acceder a ellos
        const idorden = event.context.params?.idorden;
        const idproducto = event.context.params?.idproducto;

        if (!idorden || !idproducto) {
            return { statusCode: 400, message: "ID de orden y ID de producto requeridos" };
        }

        // Leer el cuerpo de la solicitud
        const body = await readBody(event);
        if (!body || Object.keys(body).length === 0) {
            return { statusCode: 400, message: "Datos para actualizar requeridos" };
        }

        // Intentar actualizar el detalle de la orden en SQL Server
        const resultado = await detalleordenesSqlServer.update(body, { where: { idorden, idproducto } });

        // Verificar si la actualización realmente ocurrió
        if (resultado[0] === 0) {
            return { statusCode: 404, message: "Detalle de orden no encontrado o sin cambios" };
        }

        return { statusCode: 200, message: "Detalle de orden actualizado correctamente" };
    } catch (error) {
        console.error("Error al actualizar detalle de orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});