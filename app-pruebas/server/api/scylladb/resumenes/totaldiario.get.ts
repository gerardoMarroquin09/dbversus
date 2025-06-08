//Devolveremos las fechas y la suma de las ordenes en esas fechas
//ordenando por la fecha

// implementacion en scylladb

import { scylladb } from "../../../utils/scylladb/scylladb"; // Importa la conexión de scylladb

export default defineEventHandler(async (event) => {
  try {
    // 1. Obtener todas las órdenes
    const ordenesQuery = "SELECT id, fecha, total FROM cafeteria.ordenes;";
    const ordenesResult = await scylladb.execute(ordenesQuery);

    // Objeto para almacenar la suma de totales por fecha
    const totalesPorFecha: { [key: string]: number } = {};

    // 2. Procesar las órdenes
    for (const orden of ordenesResult.rows) {
      const fecha = new Date(orden.fecha).toISOString().split("T")[0]; // Formato YYYY-MM-DD
      const total = parseFloat(orden.total);

      // Sumar los totales por fecha
      if (totalesPorFecha[fecha]) {
        totalesPorFecha[fecha] += total;
      } else {
        totalesPorFecha[fecha] = total;
      }
    }

    // 3. Convertir el objeto a un array y ordenar por fecha
    const data = Object.keys(totalesPorFecha)
      .map((fecha) => ({
        fecha: fecha,
        total: totalesPorFecha[fecha],
      }))
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      ); // Ordenar por fecha ascendente

    return { statusCode: 200, data };
  } catch (error) {
    console.error("Error totaldiario:", error);
    return { statusCode: 500, error: "Internal Server Error" };
  }
});

// import { scylladb } from "../../../utils/scylladb/scylladb";

// export default defineEventHandler(async (event) => {
//   try {
//     const data = await scylladb.execute(
//       "SELECT fecha, sum(total) as total FROM ordenes GROUP BY fecha ORDER BY fecha"

//     );
//     return { statusCode: 200, data };
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     return error;
//   }
// });

// import { ordenes } from "../../../utils/mysql/mysql";
// export default defineEventHandler(async (event) => {
//     try {
//         const data = await ordenes.findAll({
//             attributes: [[sequelize.fn('date', sequelize.col('fecha')), 'fecha'], [sequelize.fn('sum', sequelize.col('total')), 'total']],
//             group: 'fecha',
//             order: [[sequelize.fn('date', sequelize.col('fecha')), 'ASC']],
//             raw: true
//         });
//         return { statusCode:200, data };

//       } catch (error) {
//         console.error('Error totaldiario:', error);
//         return(error)
//       }
// })
