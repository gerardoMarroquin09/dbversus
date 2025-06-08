//consultas de resumenes o totales

// 📌 Función para contar las ordenes
async function resumenesContarOrdenesScylladb(): Promise<number> {
  let start = new Date().getTime();
  await $fetch("http://localhost:3000/api/scylladb/resumenes/countordenes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      return -1;
    },
  });
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para obtener los productos
async function resumenesProductosScylladb(): Promise<number> {
  let start = new Date().getTime();
  await $fetch("http://localhost:3000/api/scylladb/resumenes/productosdiarios", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      return -1;
    },
  });
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para obtener los productos por fecha
async function resumenesProductosFechaScylladb(): Promise<number> {
  let start = new Date().getTime();
  let anio = new Date().getFullYear();
  let mes = Math.floor(Math.random() * 12) + 1;
  let dia = Math.floor(Math.random() * 28 + 1);
  let fecha = anio + "-" + mes + "-" + dia;

  await $fetch(
    "http://localhost:3000/api/scylladb/resumenes/productosdiariosfecha?fecha=" +
      fecha,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      onRequestError({ request, options, error }) {
        return -1;
      },
    }
  );
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para obtener los productos más vendidos
async function resumenesTotalDiarioScylladb(): Promise<number> {
  let start = new Date().getTime();
  await $fetch("http://localhost:3000/api/scylladb/resumenes/totaldiario", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      return -1;
    },
  });
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

// 📌 Función para obtener los productos más vendidos
async function resumenesToptenScylladb(): Promise<number> {
  let start = new Date().getTime();
  await $fetch("http://localhost:3000/api/scylladb/resumenes/topten", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      return -1;
    },
  });
  let end = new Date().getTime();
  let time = end - start;
  return time;
}

export {
  resumenesContarOrdenesScylladb,
  resumenesProductosScylladb,
  resumenesProductosFechaScylladb,
  resumenesToptenScylladb,
  resumenesTotalDiarioScylladb,
};
