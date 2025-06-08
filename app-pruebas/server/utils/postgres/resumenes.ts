//consultas de resumenes o totales
async function resumenesContarOrdenes(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/postgres/resumenes/countordenes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequestError({ request, options, error }) {
            return -1;
        },
    })
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesProductos(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/postgres/resumenes/productosdiarios', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequestError({ request, options, error }) {
            return -1;
        },
    })
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesTotalDiario() : Promise<number> {
    let start = new Date().getTime();
    await $fetch('/api/postgres/resumenes/totaldiario', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequestError({ request, options, error }) {
            return -1;
        },
    })
    let end = new Date().getTime();
    let time = end - start;
    return time;
}
async function resumenesProductosFecha(): Promise<number> {
    let start = new Date().getTime();
    let anio = new Date().getFullYear();        
    let mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    let dia = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
    let fecha = `${anio}-${mes}-${dia}`;

    console.log("Fecha generada:", fecha); // Útil para depurar

    try {
        await $fetch('/api/postgres/resumenes/productosdiariosfecha?fecha=' + fecha, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error("Error en productosdiariosfecha:", error);
        return -1;
    }

    let end = new Date().getTime();
    return end - start;
}


async function resumenesTopten(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/postgres/resumenes/topten', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequestError({ request, options, error }) {
            return -1;
        },
    })
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

export { resumenesContarOrdenes, resumenesProductos, resumenesProductosFecha, resumenesTotalDiario, resumenesTopten };