import { categoriasSqlServer } from "../../utils/sqlserver/sqlserver"; // Migración de MySQL a SQL Server

export default defineEventHandler(async (event) => {
    try {
        // Leer el cuerpo de la solicitud
        const body = await readBody(event);

        if (!body || !body.nombre) {
            return { statusCode: 400, message: "Datos de la categoría requeridos" };
        }

        // Intentar insertar la categoría en SQL Server
        const data = await categoriasSqlServer.create({
            id: body.id,
            nombre: body.nombre,
        });

        return { statusCode: 200, message: "Categoría insertada correctamente", data };
    } catch (error) {("Error al insertar categoría en SQL Server:", error);
        return { statusCode: 500, error: "Error en la base de datos", details: error };
    }
        console.error
});