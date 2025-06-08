
//consultas de resumenes o totales
async function resumenesContarOrdenes(ipServer:string): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('http://'+ipServer+':3000/api/mariadb/resumenes/countordenes', {
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

async function resumenesProductos(ipServer:string): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('http://'+ipServer+':3000/api/mariadb/resumenes/productosdiarios', {
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

async function resumenesProductosFecha(ipServer:string): Promise<number>  {
    let start = new Date().getTime();
    let anio = new Date().getFullYear();        
    let mes = Math.floor(Math.random() * 12)+1;
    let dia = Math.floor(Math.random() * 28 + 1);
    let fecha= anio + "-" + mes + "-" + dia;

    await $fetch('http://'+ipServer+':3000/api/mariadb/resumenes/productosdiariosfecha?fecha=' + fecha, {
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

async function resumenesTotalDiario(ipServer:string) : Promise<number> {
    let start = new Date().getTime();
    await $fetch('http://'+ipServer+':3000/api/mariadb/resumenes/totaldiario', {
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

async function resumenesTopten(ipServer:string): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('http://'+ipServer+':3000/api/mariadb/resumenes/topten', {
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