import pruebas from '../pruebas.json';

async function ordenesInsertarSqlServer(total:number, totaldetalle:number, contaInicial:number): Promise<number> {
    console.log("Iniciando inserción de órdenes");
    let start = new Date().getTime();
    for (let conta=contaInicial; conta<=Number(total) + Number(contaInicial); conta ++) {
        let anio = new Date().getFullYear();
        let mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        let dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        let lfecha: string = `${anio},${mes},${dia}`;

        const ldata = {
            id: conta,
            fecha: lfecha,
            total: Math.floor(Math.random() * 100) + 1,
        };
        // Insertar orden
        await $fetch('/api/sqlserver/orden', {
            method: 'POST',
            body: ldata,
            onRequestError({ error }) {
                console.error("Error al insertar orden:", error);
            }
        });

        // Insertar detalles de la orden
        await detalleOrdenInsertarSqlServer(conta, totaldetalle, contaInicial);
    }
    let end = new Date().getTime();
    return end - start;
}

async function detalleOrdenInsertarSqlServer(idOrden: number, totaldetalle: number, contaInicial:number) {
    for (let j = contaInicial; j <= Number(totaldetalle) + Number(contaInicial) ; j++) {
        const ldatadetalle = {                        
                        idorden: idOrden,
                        //idproducto: Math.floor(Math.random() * (pruebas.productos.insertar/2)) + 1,
                        idproducto:j,
                        cantidad: Math.floor(Math.random() * 10) + 1,
                        precio: Math.floor(Math.random() * 100) + 1,
                    }
        // Insertar detalle de orden
        await $fetch('/api/sqlserver/detalleorden', {
            method: 'POST',
            body: ldatadetalle,
            onRequestError({ error }) {
                console.error("Error al insertar detalle de orden:", error);
            }
        });
    }
}

async function ordenesConsultarAzarSqlServer(total:number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.ordenes.insertar) + Number(contaInicial); // ID aleatorio
        // Consultar orden
        await $fetch(`/api/sqlserver/orden/${id}`, {
            method: 'GET',
            onRequestError({ error }) {
                console.error("Error al consultar orden:", error);
            }
        });
        // Consultar detalles de la orden
        await $fetch(`/api/sqlserver/detalleorden/${id}`, {
            method: 'GET',
            onRequestError({ error }) {
                console.error("Error al consultar detalles:", error);
            }
        });
    }
    let end = new Date().getTime();
    return end - start;
}

async function ordenesActualizarSqlServer(total:number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            fecha: new Date().toISOString(), // Formato ISO para SQL Server
            total: Math.floor(Math.random() * 100) + 1,
        };
        // Actualizar orden
        await $fetch(`/api/sqlserver/orden/${i}`, {
            method: 'PUT',
            body: ldata,
            onRequestError({ error }) {
                console.error("Error al actualizar orden:", error);
            }
        });

        // Actualizar detalles de la orden
        let detalles = await $fetch(`/api/sqlserver/detalleorden/${i}`, {
            method: 'GET',
            onRequestError({ error }) {
                console.error("Error al consultar detalles:", error);
            }
        });

        let ldetalles = detalles.data;
        for (let detalle of ldetalles) {
            const ldatadetalle = {
                idorden: i,
                idproducto: detalle.idproducto,
                cantidad: detalle.cantidad * 2, // Multiplica cantidad por 2
                precio: detalle.precio,
            };
            // Actualizar detalle
            await $fetch(`/api/sqlserver/detalleorden/${detalle.idorden}/${detalle.idproducto}`, {
                method: 'PUT',
                body: ldatadetalle,
                onRequestError({ error }) {
                    console.error("Error al actualizar detalle:", error);
                }
            });
        }
    }
    let end = new Date().getTime();
    return end - start;
}

async function ordenesEliminarSqlServer(total:number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        // Eliminar orden
        await $fetch(`/api/sqlserver/orden/${i}`, {
            method: 'DELETE',
            body: { id: i },
            onRequestError({ error }) {
                console.error("Error al eliminar orden:", error);
            }
        });
    }
    let end = new Date().getTime();
    return end - start;
}

export { ordenesInsertarSqlServer, ordenesConsultarAzarSqlServer, ordenesActualizarSqlServer, ordenesEliminarSqlServer };
