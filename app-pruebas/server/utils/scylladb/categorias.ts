import { v4 as uuidv4 } from "uuid";

const uuidsCategorias: string[] = []; // Aquí guardamos los UUIDsCategorias generados

// 📌 Función para insertar categorias
async function categoriasInsertarScylladb(total: number): Promise<number> {
  console.log("Iniciando insercion de categorias");
  let start = new Date().getTime();

  for (let i = 1; i <= total; i++) {
    const id = uuidv4();
    const ldata = {
      id: id,
      nombre: "Categoria " + i,
    };

    // Guardar el UUID en el array
    uuidsCategorias.push(id);

    //agrego usando $fetch
    await $fetch("http://localhost:3000/api/scylladb/categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        console.error(error);
        return -1;
      },
    });
  }
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para consultar categorias
async function categoriasConsultarScylladb(): Promise<number> {
  let start = new Date().getTime();
  await $fetch("http://localhost:3000/api/scylladb/categorias", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      console.error(error);
      return -1;
    },
  });
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para consultar categorias al azar
async function categoriasConsultarAzarScylladb(
  total: number
): Promise<number> {
  let start = new Date().getTime();
  for (let i = 1; i <= total; i++) {
    // Seleccionamos un UUID aleatorio de la constante uuidsCategorias
    let randomUuid =
      uuidsCategorias[Math.floor(Math.random() * uuidsCategorias.length)];
    await $fetch(
      "http://localhost:3000/api/scylladb/categoria/" + randomUuid,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        onRequestError({ request, options, error }) {
          console.error(error);
          return -1;
        },
      }
    );
  }
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para actualizar categorias
async function categoriasActualizarScylladb(total: number): Promise<number> {
  let start = new Date().getTime();
  for (let i = 1; i <= total; i++) {
    // Seleccionamos un UUID en orden de la constante uuidsCategorias
    let uuid = uuidsCategorias[i - 1];

    // Preparamos los datos a enviar para la actualización
    const ldata = {
      id: uuid, // Usamos el UUID aleatorio
      nombre: "Categoria " + uuid + " Actualizada",
    };
    //agrego usando $fetch
    await $fetch("http://localhost:3000/api/scylladb/categoria/" + uuid, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        console.error(error);
        return -1;
      },
    });
  }
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para Eliminar categorias
async function categoriasEliminarScylladb(total: number): Promise<number> {
  let start = new Date().getTime();
  for (let i = 1; i <= total; i++) {
    const id = uuidsCategorias[i - 1]; // Usamos el UUID generado en la inserción

    await $fetch("http://localhost:3000/api/scylladb/categoria/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      onRequestError({ request, options, error }) {
        console.error(error);
        return -1;
      },
    });
  }
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

export {
  categoriasActualizarScylladb,
  categoriasConsultarAzarScylladb,
  categoriasConsultarScylladb,
  categoriasEliminarScylladb,
  categoriasInsertarScylladb,
  uuidsCategorias,
};
