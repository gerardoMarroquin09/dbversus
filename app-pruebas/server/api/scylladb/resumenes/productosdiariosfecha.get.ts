//mostraremos la fecha, luego el nombre del producto y la cantidad de ese producto vendido en esa fecha
//las tablas a consultar son ordenes, detalleordenes y productos
//la consulta SQL seria:
//select ordenes.fecha, detalleordenes.idproducto, productos.nombre, sum(detalleordenes.cantidad)
//from ordenes join detalleordenes on ordenes.id = detalleordenes.idorden
//join productos on detalleordenes.idproducto = productos.id
//where ordenes.fecha = '2021-09-01'
//group by ordenes.fecha, detalleordenes.idproducto, productos.nombre order by ordenes.fecha
//implementamos esta consulta sql en sequelize y el filtro por fecha se pasa como parametro

// SE DEBE INVOCAR ASI
///api/mysql/resumenes/productosdiariosfecha?fecha=2024-01-02

// Implementacion en scylladb

import { scylladb } from "../../../utils/scylladb/scylladb" // Importa la conexión de scylladb

export default defineEventHandler(async (event) => {
  try {
    // Obtener la fecha del query parameter
    const { fecha } = getQuery(event)

    // Validar que la fecha esté presente
    if (!fecha) {
      return { statusCode: 400, error: "La fecha es requerida" }
    }

    // 1. Obtener las órdenes que coinciden con la fecha
    const ordenesQuery =
      "SELECT id, fecha FROM cafeteria.ordenes WHERE fecha = ? ALLOW FILTERING;"
    const ordenesResult = await scylladb.execute(ordenesQuery, [fecha], {
      prepare: true,
    })

    // Array para almacenar los resultados finales
    const data = []

    // 2. Procesar cada orden
    for (const orden of ordenesResult.rows) {
      // Obtener los detalles de la orden
      const detalleQuery =
        "SELECT idOrden, idProducto, cantidad FROM cafeteria.detalleordenes WHERE idOrden = ? ALLOW FILTERING;"
      const detalleResult = await scylladb.execute(detalleQuery, [orden.id], {
        prepare: true,
      })

      // Procesar cada detalle de la orden
      for (const detalle of detalleResult.rows) {
        // Obtener el producto correspondiente
        const productoQuery =
          "SELECT id, nombre FROM cafeteria.productos WHERE id = ? ALLOW FILTERING;"
        const productoResult = await scylladb.execute(
          productoQuery,
          [detalle.idProducto],
          { prepare: true }
        )

        // Si se encuentra el producto, agregar los datos al resultado final
        if (productoResult.rows.length > 0) {
          const producto = productoResult.rows[0]
          data.push({
            fecha: orden.fecha.toISOString().split("T")[0], // Formato YYYY-MM-DD
            idOrden: orden.id,
            idProducto: detalle.idProducto,
            nombreProducto: producto.nombre,
            cantidad: detalle.cantidad,
          })
        }
      }
    }

    // 3. Agrupar los resultados por fecha
    const groupedData = data.reduce((acc: { [key: string]: any[] }, item) => {
      const fecha = item.fecha
      if (!acc[fecha]) {
        acc[fecha] = []
      }
      acc[fecha].push(item)
      return acc
    }, {})

    // 4. Ordenar los resultados por fecha
    const sortedData = Object.keys(groupedData)
      .sort()
      .map((fecha) => ({
        fecha,
        detalles: groupedData[fecha],
      }))

    return { statusCode: 200, data: sortedData }
  } catch (error) {
    console.error("Error productosdiarios:", error)
    return { statusCode: 500, error: "Internal Server Error" }
  }
})

// import { scylladb } from "../../../utils/scylladb/scylladb";

// type ProductoOrdenado = {
//   fecha: string;
//   idproducto: string;
//   nombre: string;
//   cantidadTotal: number;
// };

// export default defineEventHandler(async (event) => {
//   const { fecha } = getQuery(event) as { fecha: string };

//   if (!fecha) {
//     return { statusCode: 400, error: "Fecha requerida" };
//   }

//   try {
//     // 1️⃣ Obtener órdenes filtradas por fecha
//     const ordenesResult = await scylladb.execute(
//       "SELECT id FROM ordenes WHERE fecha = ?",
//       [fecha]
//     );

//     const ordenIds = ordenesResult.rows.map((row) => row.id);
//     if (ordenIds.length === 0) {
//       return { statusCode: 200, data: [] }; // No hay órdenes en esa fecha
//     }

//     // 2️⃣ Obtener los detalles de esas órdenes
//     const detalleOrdenesResult = await scylladb.execute(
//       "SELECT idorden, idproducto, cantidad FROM detalleordenes WHERE idorden IN ?",
//       [ordenIds]
//     );

//     // 3️⃣ Obtener los productos
//     const productosResult = await scylladb.execute(
//       "SELECT id, nombre FROM productos"
//     );

//     // 4️⃣ Crear un mapa de productos para búsqueda rápida
//     const productosMap: { [id: string]: string } = {};
//     productosResult.rows.forEach((row) => {
//       productosMap[row.id] = row.nombre;
//     });

//     // 5️⃣ Agrupar y sumar cantidades
//     const groupedData: { [key: string]: ProductoOrdenado } = {};

//     detalleOrdenesResult.rows.forEach((detalle) => {
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

//     // 6️⃣ Convertir a array y devolver ordenado por fecha
//     const data = Object.values(groupedData).sort((a, b) =>
//       a.idproducto.localeCompare(b.idproducto)
//     );

//     return { statusCode: 200, data };
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     return { statusCode: 500, error: error };
//   }
// });

// import { ordenes, detalleordenes, productos } from "../../../utils/mysql/mysql";
// export default defineEventHandler(async (event) => {

//     //return { statusCode:200, "hola": getQuery(event) };
//     const { fecha } = getQuery(event);
//     try {
//         const data = await ordenes.findAll({
//             attributes: ['fecha'],
//             include: [
//                 {
//                     model: detalleordenes,
//                     attributes: ['cantidad'],
//                     include: [
//                         {
//                             model: productos,
//                             attributes: ['id','nombre'],
//                         }
//                     ]
//                 }
//             ],
//             where: { fecha: fecha },
//             group: ['fecha','id', 'detalleordenes.idproducto', 'nombre'],
//             order: ['fecha']
//         });
//         return { statusCode:200, data };
//     } catch (error) {
//         console.error('Error productosdiarios:', error);
//         return(error)
//     }
// })
