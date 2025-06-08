import { detalleordenesSqlServer } from "../../utils/sqlserver/sqlserver"; // Cambié MySQL por SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Leer el cuerpo de la solicitud
        const body = await readBody(event);

        // Validar que todos los campos requeridos estén presentes
        if (!body.idorden || !body.idproducto || !body.cantidad || body.cantidad < 0 || !body.precio) {
            return { statusCode: 400, message: "Faltan campos requeridos" };
        }

        // Intentar insertar el detalle de la orden en SQL Server
        const data = await detalleordenesSqlServer.create({
            idorden: body.idorden,
            idproducto: body.idproducto,
            cantidad: body.cantidad,
            precio: body.precio
        });

        return { statusCode: 200, message: "Detalle de orden insertado correctamente", data };
    } catch (error) {
        console.error("Error al insertar detalle de orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});