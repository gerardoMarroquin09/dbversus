import { withConnection } from "../../../utils/firebird/firebird";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);
    if (isNaN(id)) {
      return { statusCode: 400, message: "ID inválido" };
    }

    // Lógica equivalente a findOne, directamente aquí
    const db: any = await withConnection();

    const data = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM CATEGORIAS WHERE ID = ?', [id], (err, results) => {
        db.detach();
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });

    if (!data) {
      return { statusCode: 404, message: "Categoría no encontrada" };
    }

    return { statusCode: 200, data };
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    return { statusCode: 500, message: "Error interno del servidor" };
  }
});
