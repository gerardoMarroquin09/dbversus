//mostraremos la fecha, luego el nombre del producto y la cantidad de ese producto vendido en esa fecha
//las tablas a consultar son ordenes, detalleordenes y productos
//la consulta SQL seria:
//select ordenes.fecha, detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad)
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id
//group by ordenes.fecha, detalleordenes.idproducto, productos.nombre order by ordenes.fecha
// para scylladb

import { scylladb } from "../../../utils/scylladb/scylladb"; // Importa la conexión de scylladb

export default defineEventHandler(async () => {
  try {
    // 1. Obtener todas las órdenes
    const ordenesQuery =
      "SELECT id, fecha FROM cafeteria.ordenes ALLOW FILTERING;";
    const ordenesResult = await scylladb.execute(ordenesQuery);

    // Array para almacenar los resultados finales
    const data = [];

    // 2. Procesar cada orden
    for (const orden of ordenesResult.rows) {
      // Obtener los detalles de la orden
      const detalleQuery =
        "SELECT idorden, idproducto, cantidad FROM cafeteria.detalleordenes WHERE idorden = ? ALLOW FILTERING;";
      const detalleResult = await scylladb.execute(detalleQuery, [orden.id], {
        prepare: true,
      });

      // Procesar cada detalle de la orden
      for (const detalle of detalleResult.rows) {
        // Obtener el producto correspondiente
        const productoQuery =
          "SELECT id, nombre FROM cafeteria.productos WHERE id = ? ALLOW FILTERING;";
        const productoResult = await scylladb.execute(
          productoQuery,
          [detalle.idproducto],
          { prepare: true }
        );

        // Si se encuentra el producto, agregar los datos al resultado final
        if (productoResult.rows.length > 0) {
          const producto = productoResult.rows[0];
          data.push({
            fecha: new Date(orden.fecha).toISOString().split("T")[0], // Formato YYYY-MM-DD
            idOrden: orden.id,
            idProducto: detalle.idProducto,
            nombreProducto: producto.nombre,
            cantidad: detalle.cantidad,
          });
        }
      }
    }

    // 3. Agrupar los resultados por fecha
    const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
      const fecha = item.fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(item);
      return acc;
    }, {});

    // 4. Ordenar los resultados por fecha
    const sortedData = Object.keys(groupedData)
      .sort()
      .map((fecha) => ({
        fecha,
        detalles: groupedData[fecha],
      }));

    return { statusCode: 200, data: sortedData };
  } catch (error) {
    console.error("Error productosdiariosget:", error);
    return { statusCode: 500, error: "Internal Server Error" };
  }
});
// import { scylladb } from "../../../utils/scylladb/scylladb";

// type ProductoOrdenado = {
//   fecha: string;
//   idproducto: string;
//   nombre: string;
//   cantidadTotal: number;
// };

// export default defineEventHandler(async (event) => {
//   try {
//     // 1️⃣ Obtener todas las órdenes con sus detalles
//     const ordenesResult = await scylladb.execute(
//       "SELECT fecha, id, total FROM ordenes"
//     );

//     const detalleOrdenesResult = await scylladb.execute(
//       "SELECT idorden, idproducto, cantidad FROM detalleordenes"
//     );

//     const productosResult = await scylladb.execute(
//       "SELECT id, nombre FROM productos"
//     );

//     // 2️⃣ Convertimos productos en un mapa para acceso rápido
//     const productosMap: { [id: string]: string } = {};
//     productosResult.rows.forEach((row) => {
//       productosMap[row.id] = row.nombre;
//     });

//     // 3️⃣ Procesamos los detalles de ordenes
//     const groupedData: { [key: string]: ProductoOrdenado } = {};

//     detalleOrdenesResult.rows.forEach((detalle) => {
//       const orden = ordenesResult.rows.find((o) => o.id === detalle.idorden);
//       if (!orden) return;

//       const fecha = orden.fecha.toISOString().split("T")[0]; // Convertir fecha a string YYYY-MM-DD
//       const idproducto = detalle.idproducto;
//       const nombre = productosMap[idproducto] || "Desconocido";
//       const key = `${fecha}-${idproducto}`; // Clave única para agrupación

//       if (!groupedData[key]) {
//         groupedData[key] = {
//           fecha,
//           idproducto,
//           nombre,
//           cantidadTotal: 0,
//         };
//       }

//       groupedData[key].cantidadTotal += detalle.cantidad;
//     });

//     // 4️⃣ Convertimos el objeto a un array y lo ordenamos por fecha
//     const data = Object.values(groupedData).sort(
//       (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
//     );

//     return { statusCode: 200, data };
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     return { statusCode: 500, error: error };
//   }
// });

// import { detalleordenes, ordenes, productos } from "../../../utils/mysql/mysql";
// export default defineEventHandler(async (event) => {
//   try {
//     const data = await ordenes.findAll({
//       attributes: ["fecha"],
//       include: [
//         {
//           model: detalleordenes,
//           attributes: ["cantidad"],
//           include: [
//             {
//               model: productos,
//               attributes: ["id", "nombre"],
//             },
//           ],
//         },
//       ],
//       group: ["fecha", "id", "detalleordenes.idproducto", "nombre"],
//       order: ["fecha"],
//     });
//     return { statusCode: 200, data };
//   } catch (error) {
//     console.error("Error productosdiarios:", error);
//     return error;
//   }
// });
