import { ordenesSqlServer } from "../../../utils/sqlserver/sqlserver";
import { Sequelize } from "sequelize";

export default defineEventHandler(async (event) => {
    try {
        // Obtener la suma total de órdenes por fecha
        const data = await ordenesSqlServer.findAll({
            attributes: [
                [Sequelize.literal("CAST(fecha AS DATE)"), "fecha"],
                [Sequelize.fn("SUM", Sequelize.col("total")), "total"]
            ],
            group: [Sequelize.literal("CAST(fecha AS DATE)")],
            order: [Sequelize.literal("CAST(fecha AS DATE)")],
            raw: true
        });

        if (!data.length) {
            return { statusCode: 404, message: "No se encontraron registros de órdenes" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar el total de órdenes por fecha en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});
