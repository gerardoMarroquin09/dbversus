import { v4 as uuidv4 } from "uuid"
import { uuidsProductos } from "./productos"

const uuidsOrdenes: string[] = [] // Lista de UUIDs de órdenes
let erroresConsulta = { value: 0 } // Contador de errores

// 📌 Función para insertar órdenes y sus detalles
async function ordenesInsertarScylladb(
  total: number,
  totaldetalle: number
): Promise<number> {
  console.log("Iniciando inserción de órdenes en Scylladb")
  let start = Date.now()

  for (let i = 0; i < total; i++) {
    let fecha = new Date().toISOString() // Fecha en formato ISO
    const uuidOrden = uuidv4() // Generamos un UUID para la orden
    uuidsOrdenes.push(uuidOrden) // Guardamos el UUID en la lista

    const ldata = {
      id: uuidOrden,
      fecha: fecha,
      total: Math.floor(Math.random() * 100) + 1,
    }

    // Insertamos la orden en Scylladb
    await $fetch("/api/scylladb/orden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ldata),
      onRequestError({ error }) {
        console.error("Error al insertar orden:", error)
        return -1
      },
    })

    // Insertamos los detalles de la orden
    await detalleOrdenInsertarScylladb(uuidOrden, totaldetalle)
  }

  return Date.now() - start
}

// 📌 Función para insertar detalles de una orden
async function detalleOrdenInsertarScylladb(
  idorden: string,
  totaldetalle: number
) {
  for (let j = 0; j < totaldetalle; j++) {
    if (uuidsProductos.length <= 0)
      console.error("No hay productos para insertar en detalle de orden")

    if (j >= uuidsProductos.length) {
      console.error("No hay suficientes UUIDs de productos.")
      throw new Error("No hay suficientes UUIDs de productos.")
    }
    const ldatadetalle = {
      idorden: idorden,
      idproducto: uuidsProductos[j],
      cantidad: Math.floor(Math.random() * 10) + 1,
      precio: Math.floor(Math.random() * 100) + 1,
    }
    await $fetch("/api/scylladb/detalleorden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ldatadetalle),
      onRequestError({ error }) {
        console.error("Error al insertar detalle de orden:", error)
      },
    })
  }
}

// 📌 Función para consultar órdenes y sus detalles aleatoriamente
async function ordenesConsultarAzarScylladb(total: number): Promise<number> {
  let start = Date.now()

  for (let i = 0; i < total; i++) {
    let randomUuid =
      uuidsOrdenes[Math.floor(Math.random() * uuidsOrdenes.length)]

    // Consultar orden
    await $fetch(`/api/scylladb/orden/${randomUuid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      onRequestError({ error }) {
        console.error("Error al consultar orden:", error)
        erroresConsulta.value++
      },
    })

    // Consultar detalles de la orden
    await ordenesdetallesConsultarAzarScylladb(randomUuid)
  }

  return Date.now() - start
}

// 📌 Función para consultar detalles de una orden aleatoriamente
async function ordenesdetallesConsultarAzarScylladb(idorden: string) {
  let datos = await $fetch(`/api/scylladb/detalleorden/${idorden}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    onRequestError({ error }) {
      console.error("Error al obtener detalles de la orden:", error)
      erroresConsulta.value++
    },
  })
}

// 📌 Función para actualizar órdenes y sus detalles
async function ordenesActualizarScylladb(total: number): Promise<number> {
  let start = Date.now()

  for (let i = 0; i < total; i++) {
    let uuid = uuidsOrdenes[i]

    const ldata = {
      id: uuid,
      fecha: new Date().toISOString(),
      total: Math.floor(Math.random() * 100) + 1,
    }

    // Actualizar orden
    await $fetch(`/api/scylladb/orden/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ldata),
      onRequestError({ error }) {
        console.error("Error al actualizar orden:", error)
        return -1
      },
    })

    // Obtener detalles actuales de la orden
    let datos = await $fetch(`/api/scylladb/detalleorden/${uuid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      onRequestError({ error }) {
        console.error("Error al obtener detalles de la orden:", error)
        erroresConsulta.value++
      },
    })

    let ldatos = datos.data
    if (!Array.isArray(ldatos)) continue // Si la respuesta no es un array, evitar errores

    // Multiplicar cantidad x2 y actualizar cada detalle
    for (let j = 0; j < ldatos.length; j++) {
      const ldatadetalle = {
        idorden: uuid,
        idproducto: ldatos[j].idproducto,
        cantidad: ldatos[j].cantidad * 2,
        precio: ldatos[j].precio,
      }

      await $fetch(
        `/api/scylladb/detalleorden/${uuid}/${ldatos[j].idproducto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ldatadetalle),
          onRequestError({ error }) {
            console.error("Error al actualizar detalle de orden:", error)
            return -1
          },
        }
      )
    }
  }

  return Date.now() - start
}

// 📌 Función para eliminar órdenes y sus detalles
async function ordenesEliminarScylladb(total: number): Promise<number> {
  let start = new Date().getTime()
  for (let i = 0; i < total; i++) {
    let uuid = uuidsOrdenes[i]
    await $fetch("/api/scylladb/orden/" + uuid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: uuid }),
      onRequestError({ request, options, error }) {
        return -1
      },
    })

    // Eliminar detalles de la orden
    await detalleOrdenEliminarScylladb(uuid)
  }
  let end = new Date().getTime()
  let time = end - start
  return time
}

//  Funcion para Eliminar los detalles de la orden
async function detalleOrdenEliminarScylladb(idorden: string) {
  await $fetch(`/api/scylladb/detalleorden/${idorden}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idorden }),
    onRequestError({ request, options, error }) {
      return -1
    },
  })
  // let datos = await $fetch(
  //   `/api/Scylladb/detalleorden/${idorden}`,
  //   {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //     onRequestError({ error }) {
  //       console.error("Error al obtener detalles de la orden:", error);
  //       erroresConsulta.value++;
  //     },
  //   }
  // );

  // let ldatos = datos.data;
  // if (!Array.isArray(ldatos)) return; // Si la respuesta no es un array, evitar errores

  // for (let j = 0; j < ldatos.length; j++) {
  //   await $fetch(
  //     `/api/Scylladb/detalleorden/${idorden}/${ldatos[j].idproducto}`,
  //     {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ idorden: idorden, idproducto: ldatos[j].idproducto }),
  //       onRequestError({ error }) {
  //         console.error("Error al eliminar detalle de orden:", error);
  //         return -1;
  //       },
  //     }
  //   );
  // }
}

export {
  ordenesActualizarScylladb,
  ordenesConsultarAzarScylladb,
  ordenesEliminarScylladb,
  ordenesInsertarScylladb,
}
