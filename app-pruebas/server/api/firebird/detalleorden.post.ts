import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { idorden, idproducto, cantidad, precio } = body;

    if (
      idorden === undefined ||
      idproducto === undefined ||
      cantidad === undefined ||
      precio === undefined
    ) {
      return {
        statusCode: 400,
        message: "Todos los campos (idorden, idproducto, cantidad, precio) son obligatorios",
      };
    }

    const db: any = await withConnection();

    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO DETALLEORDENES (IDORDEN, IDPRODUCTO, CANTIDAD, PRECIO) VALUES (?, ?, ?, ?)",
        [idorden, idproducto, cantidad, precio],
        (err, res) => {
          db.detach();
          if (err) {
            reject(err);
          } else {
            resolve({ idorden, idproducto, cantidad, precio });
          }
        }
      );
    });

    return {
      statusCode: 201,
      message: "Detalle de orden insertado correctamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al insertar el detalle de orden:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
