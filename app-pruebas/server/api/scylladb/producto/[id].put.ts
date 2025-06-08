//se va actualizar los productos con el id que viene en el get y el json de la data
import { scylladb } from "../../../utils/scylladb/scylladb";

export default defineEventHandler(async (event) => {
  try {
    // Leer el cuerpo de la solicitud (los datos del producto)
    const body = await readBody(event);

    // Obtener el UUID del parámetro de la URL (el UUID del producto a actualizar)
    const productId = event.context.params?.id; // Este es el UUID

    // Generar la consulta CQL para actualizar el producto
    const query = `
      UPDATE productos 
      SET nombre = ?, precio = ?, idcategoria = ? 
      WHERE id = ?;
    `;

    // Ejecutar la consulta en scylladb
    await scylladb.execute(
      query,
      [body.nombre, body.precio, body.idcategoria, productId],
      {
        prepare: true,
      }
    );
    return { statusCode: 200, message: "Producto actualizado exitosamente" };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return {
      statusCode: 500,
      message: "Error al actualizar el producto",
      error,
    };
  }
});
