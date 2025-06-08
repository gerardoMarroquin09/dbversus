import { productosSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de producto requerido" };
        }

        // Buscar el producto en SQL Server
        const data = await productosSqlServer.findOne({ where: { id } });

        if (!data) {
            return { statusCode: 404, message: "Producto no encontrado" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar producto en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});