import { withConnection } from "../../utils/firebird/firebird";

// obtenemos todas las categorías de la base de datos
export default defineEventHandler(async (event) => {
  try {
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM CATEGORIAS', (err, results) => {
        db.detach();
        if (err) reject(err);
        else resolve(results);
      });
    });

    return { statusCode: 200, data };
  } catch (error) {
    console.error('DB Error:', error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});

