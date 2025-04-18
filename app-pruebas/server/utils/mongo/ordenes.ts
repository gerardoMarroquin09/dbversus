import pruebas from '../pruebas.json'

async function ordenesInsertarMongo(total: number, totaldetalle: number): Promise<number> {
  console.log("Iniciando inserción de órdenes en MongoDB")
  let start = new Date().getTime();

  for (let conta = 1; conta <= total; conta++) {
    let anio = new Date().getFullYear();
    let mes = Math.floor(Math.random() * 12) + 1;
    let dia = Math.floor(Math.random() * 28 + 1);
    let lfecha = new Date(anio, mes - 1, dia); // Mongo espera objeto Date, no string

    // Generar los detalles como subdocumentos
    let detalleOrden = [];
    for (let j = 1; j <= totaldetalle; j++) {
      detalleOrden.push({
        cantidad: Math.floor(Math.random() * 10) + 1,
        nombre: `Producto ${j}`,
        precio: Math.floor(Math.random() * 100) + 1,
        categoria: {
          nombre: Math.random() > 0.5 ? "Platos" : "Bebidas"
        },
        subtotal: 0 // se calcula abajo
      });
      detalleOrden[j - 1].subtotal = detalleOrden[j - 1].cantidad * detalleOrden[j - 1].precio;
    }

    // Sumar total
    const totalOrden = detalleOrden.reduce((acc, item) => acc + item.subtotal, 0);

    const ldata = {
      fecha: lfecha,
      mesero: "AutoInsert",
      mesa: `${Math.floor(Math.random() * 10) + 1}`,
      cliente: `Cliente ${conta}`,
      estado: "C",
      observacion: "Generada automáticamente",
      total: totalOrden,
      detalleOrden
    };

    await $fetch('http://localhost:3000/api/mongo/orden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        console.error("Error insertando orden Mongo:", error);
        return -1;
      }
    });
  }

  let end = new Date().getTime();
  return end - start;
}

async function ordenesConsultarAzarMongo(total: number): Promise<number> {
  let start = new Date().getTime();
  for (let i = 1; i <= total; i++) {
    let id = Math.floor(Math.random() * pruebas.ordenes.insertar) + 1;
    await $fetch(`http://localhost:3000/api/mongo/ordenes/`+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      onRequestError({ request, options, error }) {
        console.error("Error consultando orden Mongo:", error);
        return -1;
      },
    });
  }
  let end = new Date().getTime();
  return end - start;
}

async function ordenesActualizarMongo(total: number): Promise<number> {
  let start = new Date().getTime();

  for (let i = 1; i <= total; i++) {
    // Simular traer el documento (necesario para modificar)
    const orden = await $fetch(`http://localhost:3000/api/mongo/ordenes/${i}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      onRequestError({ request, options, error }) {
        console.error("Error consultando orden antes de actualizar:", error);
        return null;
      },
    });

    if (!orden) continue;

    // Modificar los detalles (ej: duplicar cantidades)
    const detalleModificado = orden.detalleOrden.map((item: any) => {
      const nuevaCantidad = item.cantidad * 2;
      const nuevoSubtotal = nuevaCantidad * item.precio;
      return {
        ...item,
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal
      };
    });

    const nuevoTotal = detalleModificado.reduce((acc: number, item: any) => acc + item.subtotal, 0);

    const ldata = {
      ...orden,
      detalleOrden: detalleModificado,
      total: nuevoTotal,
      fecha: new Date()
    };

    await $fetch(`http://localhost:3000/api/mongo/ordenes/${orden._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ldata),
      onRequestError({ request, options, error }) {
        console.error("Error actualizando orden Mongo:", error);
        return -1;
      },
    });
  }

  let end = new Date().getTime();
  return end - start;
}

async function ordenesEliminarMongo(total: number): Promise<number> {
  let start = new Date().getTime();

  for (let i = 1; i <= total; i++) {
    await $fetch(`http://localhost:3000/api/mongo/ordenes/${i}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: i }),
      onRequestError({ request, options, error }) {
        console.error("Error eliminando orden Mongo:", error);
        return -1;
      },
    });
  }

  let end = new Date().getTime();
  return end - start;
}

export {
  ordenesInsertarMongo,
  ordenesConsultarAzarMongo,
  ordenesActualizarMongo,
  ordenesEliminarMongo
}