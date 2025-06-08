//este end poin ejecuta la siguiente consulta sql para obtener el top ten
// de productos vendidos
//select detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad)
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id
//group by productos.id, productos.nombre
//order by 3 desc
//limit 10

// implementar en scylladb

import { scylladb } from "../../../utils/scylladb/scylladb"; // Importa la conexión de scylladb

export default defineEventHandler(async (event) => {
  try {
    // 1. Obtener todos los detalles de las órdenes
    const detalleQuery =
      "SELECT idProducto, cantidad FROM cafeteria.detalleordenes;";
    const detalleResult = await scylladb.execute(detalleQuery);

    // Objeto para almacenar la suma de cantidades por producto
    const productosMap = new Map();

    // 2. Procesar los detalles de las órdenes
    for (const detalle of detalleResult.rows) {
      const idProducto = detalle.idproducto;
      const cantidad = detalle.cantidad;

      // Sumar las cantidades por producto
      if (productosMap.has(idProducto)) {
        productosMap.set(idProducto, productosMap.get(idProducto) + cantidad);
      } else {
        productosMap.set(idProducto, cantidad);
      }
    }

    // 3. Obtener los nombres de los productos
    const productosData = [];
    for (const [idProducto, cantidad] of productosMap.entries()) {
      const productoQuery =
        "SELECT id, nombre FROM cafeteria.productos WHERE id = ?;";
      const productoResult = await scylladb.execute(
        productoQuery,
        [idProducto],
        { prepare: true }
      );

      if (productoResult.rows.length > 0) {
        const producto = productoResult.rows[0];
        productosData.push({
          idProducto: producto.id,
          nombre: producto.nombre,
          cantidad: cantidad,
        });
      }
    }

    // 4. Ordenar los productos por cantidad (descendente) y limitar a 10
    const sortedData = productosData
      .sort((a, b) => b.cantidad - a.cantidad) // Ordenar por cantidad descendente
      .slice(0, 10); // Limitar a los 10 primeros

    return { statusCode: 200, data: sortedData };
  } catch (error) {
    console.error("Error topten:", error);
    return { statusCode: 500, error: "Internal Server Error" };
  }
});

// import { scylladb } from "../../../utils/scylladb/scylladb";

// export default defineEventHandler(async (event) => {
//   try {
//     const query =
//       "SELECT idproducto, nombre, cantidad_vendida FROM productos_ventas ORDER BY cantidad_vendida DESC LIMIT 10";
//     const result = await scylladb.execute(query);
//     return { statusCode: 200, data: result.rows };
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     return { statusCode: 500, error: "Internal Server Error" };
//   }
// });

// import { ordenes, detalleordenes, productos } from "../../../utils/mysql/mysql";
// export default defineEventHandler(async (event) => {
//     try {
//         const data = await detalleordenes.findAll({
//             attributes: ['idproducto', [sequelize.fn('sum', sequelize.col('cantidad')), 'cantidad']],
//             include: [
//                 {
//                     model: productos,
//                     attributes: ['nombre'],
//                 }
//             ],
//             group: ['idproducto', 'nombre'],
//             order: [[sequelize.fn('sum', sequelize.col('cantidad')), 'DESC']],
//             limit: 10
//         });
//         return { statusCode:200, data };
//     } catch (error) {
//         console.error('Error topten:', error);
//         return(error)
//     }
// })
