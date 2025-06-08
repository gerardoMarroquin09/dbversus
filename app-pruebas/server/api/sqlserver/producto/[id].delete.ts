import { productosSqlServer } from "../../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Validar si el parámetro `id` existe antes de acceder a él
        const id = event.context.params?.id;
        if (!id) {
            return { statusCode: 400, message: "ID de producto requerido" };
        }

        // Intentar eliminar el producto en SQL Server
        const resultado = await productosSqlServer.destroy({
            where: { id }
        });

        // Verificar si la eliminación realmente ocurrió
        if (resultado === 0) {
            return { statusCode: 404, message: "Producto no encontrado" };
        }

        return { statusCode: 200, message: "Producto eliminado correctamente" };
    } catch (error) {
        console.error("Error al eliminar producto en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});