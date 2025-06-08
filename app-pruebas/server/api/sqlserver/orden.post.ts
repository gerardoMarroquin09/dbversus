import { ordenesSqlServer } from "../../utils/sqlserver/sqlserver"; // Migración de MySQL a SQL Server
import { Sequelize } from "sequelize";

export default defineEventHandler(async (event) => {
    try {
        // Leer el cuerpo de la solicitud
        const body = await readBody(event);

        // Validar que todos los campos requeridos estén presentes
        if (!body.id || !body.fecha || !body.total || body.total < 0) {
            return { statusCode: 400, message: "Faltan campos requeridos" };
        }

        // La fecha viene en formato string "YYYY,MM,DD", convertimos correctamente
        const [anho, mes, dia] = body.fecha.split(",");
        const lfecha = new Date(`${anho}-${mes}-${dia}T00:00:00Z`); // Formato ISO compatible con SQL Server

        // Insertar la orden en SQL Server
        const data = await ordenesSqlServer.create({
            id: body.id,
            fecha: lfecha,
            total: body.total
        });

        return { statusCode: 200, message: "Orden insertada correctamente", data };
    } catch (error) {
        console.error("Error al insertar orden en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
});