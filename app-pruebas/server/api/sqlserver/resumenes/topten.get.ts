import { detalleordenesSqlServer, productosSqlServer } from "../../../utils/sqlserver/sqlserver";
import { Sequelize } from "sequelize";

export default defineEventHandler(async (event) => {
    try {
        const data = await detalleordenesSqlServer.findAll({
            attributes: [
                "idproducto",
                [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_vendida"],
                [Sequelize.col("producto.nombre"), "producto_nombre"]
            ],
            include: [
                {
                    model: productosSqlServer,
                    as: "producto",
                    attributes: []
                }
            ],
            group: ["idproducto", "producto.nombre", "detalleordenes.idorden"], // ✅ Agregado para evitar error en ORDER BY
            order: [[Sequelize.fn("SUM", Sequelize.col("cantidad")), "DESC"]], // ✅ Corrección en ORDER BY
            limit: 10,
            subQuery: false // ✅ Evita subqueries innecesarias
        });

        if (!data.length) {
            return { statusCode: 404, message: "No se encontraron productos vendidos" };
        }

        return { statusCode: 200, data };
    } catch (error) {
        console.error("Error al consultar el top de productos vendidos en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error.message };
    }
});