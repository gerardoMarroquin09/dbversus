import { ordenesSqlServer, detalleordenesSqlServer, productosSqlServer } from "../../../utils/sqlserver/sqlserver";
import { Sequelize } from "sequelize";

export default defineEventHandler(async (event) => {
    try {
        const { fecha } = getQuery(event);
        if (!fecha) {
            return { statusCode: 400, message: "Fecha requerida para la consulta" };
        }

        const data = await ordenesSqlServer.findAll({
            attributes: [
                [Sequelize.literal("CAST(ordenes.fecha AS DATE)"), "fecha"]
            ],
            include: [
                {
                    model: detalleordenesSqlServer,
                    attributes: [
                        [Sequelize.fn("SUM", Sequelize.col("detalleordenes.cantidad")), "cantidad_vendida"]
                    ],
                    include: [
                        {
                            model: productosSqlServer,
                            attributes: ["id", "nombre"]
                        }
                    ]
                }
            ],
            where: {
                fecha
            },
            group: [
                Sequelize.literal("CAST(ordenes.fecha AS DATE)"),
                "detalleordenes.idproducto",
                "detalleordenes->producto.nombre",
                "detalleordenes->producto.id"
            ],
            order: [Sequelize.literal("CAST(ordenes.fecha AS DATE)")],
            raw: true
        });

        if (!data.length) {
            return { statusCode: 404, message: "No se encontraron productos vendidos en la fecha indicada" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar productos vendidos en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});
