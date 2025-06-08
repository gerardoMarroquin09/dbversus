//devolvemos la fecha y el total de ordenes que se han hecho en esa fecha, ordenado por fecha
// implementacion con scylladb

import { scylladb } from "../../../utils/scylladb/scylladb";

type OrdenesAgrupadas = {
  [fecha: string]: { fecha: string; totalOrdenes: number };
};

export default defineEventHandler(async () => {
  try {
    // Consulta CQL para obtener todas las órdenes
    const query = "SELECT id, fecha FROM cafeteria.ordenes;";

    // Ejecutar la consulta
    const result = await scylladb.execute(query);

    // Procesar los datos para agrupar por fecha y contar las órdenes
    const groupedData: OrdenesAgrupadas = result.rows.reduce<OrdenesAgrupadas>(
      (acc, orden) => {
        const fecha = new Date(orden.fecha).toISOString().split("T")[0]; // Convertir la fecha a formato YYYY-MM-DD
        if (!acc[fecha]) {
          acc[fecha] = {
            fecha: fecha,
            totalOrdenes: 0,
          };
        }
        acc[fecha].totalOrdenes += 1;
        return acc;
      },
      {}
    );

    // Convertir el objeto agrupado a un array
    const data = Object.values(groupedData);

    // Ordenar el resultado por fecha ascendente
    data.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    return { statusCode: 200, data };
  } catch (error) {
    console.error(
      "❌ Error al obtener los resúmenes de productos diarios:",
      error
    );
    return { statusCode: 500, error: "Internal Server Error" };
  }
});

// import { ordenes } from "../../../utils/mysql/mysql";
// export default defineEventHandler(async (event) => {
//   try {
//     const data = await ordenes.findAll({
//       attributes: [
//         [sequelize.fn("date", sequelize.col("fecha")), "fecha"],
//         [sequelize.fn("count", sequelize.col("id")), "totalOrdenes"],
//       ],
//       group: "fecha",
//       order: [[sequelize.fn("date", sequelize.col("fecha")), "ASC"]],
//       raw: true,
//     });
//     return { statusCode: 200, data };
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     return error;
//   }
// });
