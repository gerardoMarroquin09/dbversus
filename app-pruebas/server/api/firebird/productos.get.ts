import { withConnection } from "../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const productos = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM PRODUCTOS", (err, results) => {
        db.detach();
        if (err) reject(err);
        else resolve(results);
      });
    });

    return {
      statusCode: 200,
      message: "Lista de productos obtenida correctamente",
      data: productos,
    };
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
