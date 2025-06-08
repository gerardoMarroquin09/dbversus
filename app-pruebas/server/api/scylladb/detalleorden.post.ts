import { scylladb } from "../../utils/scylladb/scylladb";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Consulta CQL para insertar datos en la tabla "detalleorden"
    const query = `INSERT INTO detalleordenes (idorden, idproducto, cantidad, precio) VALUES (?, ?, ?, ?)`;

    // Ejecución de la consulta con los valores
    await scylladb.execute(
      query,
      [body.idorden, body.idproducto, body.cantidad, body.precio],
      { prepare: true }
    );

    return { statusCode: 200, message: "insertado" };
  } catch (error) {
    console.error("Error al conectar con Scylladb:", error);
    return { statusCode: 500, message: "Error en la base de datos", error };
  }
});
