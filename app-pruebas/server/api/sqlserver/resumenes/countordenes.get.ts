import { ordenesSqlServer } from "../../../utils/sqlserver/sqlserver";
import { Sequelize } from "sequelize";

export default defineEventHandler(async (event) => {
    try {
        // Obtener la fecha y el total de órdenes realizadas en esa fecha, ordenado por fecha
        const data = await ordenesSqlServer.findAll({
            attributes: [
                [Sequelize.cast(Sequelize.col("fecha"), "DATE"), "fecha"],  // ✅ Uso correcto de CAST
                [Sequelize.fn("COUNT", Sequelize.col("id")), "totalOrdenes"]
            ],
            group: ["fecha"], // ✅ Agrupar directamente por la columna sin CAST
            order: [["fecha", "ASC"]], // ✅ Ordenar directamente por la columna sin CAST
            raw: true
        });

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar órdenes en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});