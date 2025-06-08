import { ordenesSqlServer, detalleordenesSqlServer, productosSqlServer } from "../../../utils/sqlserver/sqlserver";
import { Sequelize } from "sequelize";
import moment from "moment";

export default defineEventHandler(async (event) => {
    try {
        const fecha = moment().format("YYYY-MM-DD"); 
        console.log("Fecha antes de la consulta:", fecha);

        const data = await ordenesSqlServer.findAll({
            attributes: [
                [Sequelize.literal("CAST(ordenes.fecha AS DATE)"), "fecha"],
                [Sequelize.fn("SUM", Sequelize.col("detalleordenes.cantidad")), "cantidad_vendida"],
                [Sequelize.col("detalleordenes->producto.nombre"), "producto_nombre"]
            ],
            include: [
                {
                    model: detalleordenesSqlServer,
                    attributes: [],
                    include: [
                        {
                            model: productosSqlServer,
                            attributes: []
                        }
                    ]
                }
            ],
            group: [
                Sequelize.literal("CAST(ordenes.fecha AS DATE)"),
                "detalleordenes.idproducto",
                "detalleordenes->producto.nombre"
            ],
            order: [Sequelize.literal("CAST(ordenes.fecha AS DATE)")],
            raw: true
        });

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar ventas diarias en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});
