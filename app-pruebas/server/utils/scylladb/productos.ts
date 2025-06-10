import { v4 as uuidv4 } from "uuid"
import { uuidsCategorias } from "./categorias"

const uuidsProductos: string[] = [] // Aquí guardamos los UUIDs generados

// 📌 Función para  insertar productos
async function productosInsertarScylladb(total: number): Promise<number> {
  console.log("Iniciando inserción de productos")
  let start = new Date().getTime()

  for (let i = 1; i <= total; i++) {
    const id = uuidv4() // Generamos un nuevo UUID para el producto

    // Seleccionar una categoría aleatoria usando UUID si `uuidsCategorias` ya tiene valores
    const randomCategoryUUID =
      uuidsCategorias.length > 0
        ? uuidsCategorias[Math.floor(Math.random() * uuidsCategorias.length)]
        : uuidv4() // Si no hay categorías guardadas, se genera uno nuevo (esto no es ideal, mejor cargar categorías antes)
    const ldata = {
      id: id, // Ahora `id` es un UUID
      idcategoria: randomCategoryUUID, // Usamos UUID para categorías también
      nombre: "Producto " + i,
      precio: Math.floor(Math.random() * 100) + 1,
    }

    // Guardamos el UUID generado en la lista para futuras consultas
    uuidsProductos.push(id)

    // Hacemos la petición para insertar en Scylladb
    await $fetch("/api/scylladb/producto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        console.error(error)
      },
    })
  }

  let end = new Date().getTime()
  let time = end - start
  return time
}

// 📌 Función para consultar productos
async function productosConsultarScylladb(): Promise<number> {
  let start = new Date().getTime()
  await $fetch("/api/scylladb/productos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    onRequestError({ request, options, error }) {
      console.error("Error al consultar productos:", error)
      return -1
    },
  })
  let end = new Date().getTime()
  let time = end - start
  return time
}

// 📌 Función para consultar productos al azar
async function productosConsultarAzarScylladb(total: number): Promise<number> {
  let start = new Date().getTime()
  for (let i = 1; i <= total; i++) {
    // Seleccionamos un UUID aleatorio de la constante uuidsProductos
    let randomUuid =
      uuidsProductos[Math.floor(Math.random() * uuidsProductos.length)]

    await $fetch("/api/scylladb/producto/" + randomUuid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      onRequestError({ request, options, error }) {
        console.log(error)
        return -1
      },
    })
  }
  let end = new Date().getTime()
  let time = end - start
  return time
}

// 📌 Función para actualizar productos
async function productosActualizarScylladb(total: number): Promise<number> {
  let start = new Date().getTime()
  for (let i = 0; i < total; i++) {
    // Seleccionamos un UUID en orden de la constante uuidsProductos
    let uuid = uuidsProductos[i]

    let randomUuid =
      uuidsCategorias[Math.floor(Math.random() * uuidsCategorias.length)]

    const ldata = {
      id: uuid,
      nombre: "Producto " + uuid + " Actualizado",
      precio: Math.floor(Math.random() * 100) + 1,
      idcategoria: randomUuid,
    }
    await $fetch("/api/scylladb/producto/" + uuid, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        return -1
      },
    })
  }
  let end = new Date().getTime()
  let time = end - start
  return time
}

// 📌 Función para eliminar productos
async function productosEliminarScylladb(total: number): Promise<number> {
  let start = new Date().getTime()
  for (let i = 0; i < total; i++) {
    const id = uuidsProductos[i] // Usamos el UUID generado en la inserción

    await $fetch("/api/scylladb/producto/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      onRequestError({ request, options, error }) {
        return -1
      },
    })
  }
  let end = new Date().getTime()
  let time = end - start
  return time
}

export {
  productosActualizarScylladb,
  productosConsultarAzarScylladb,
  productosConsultarScylladb,
  productosEliminarScylladb,
  productosInsertarScylladb,
  uuidsProductos,
}
