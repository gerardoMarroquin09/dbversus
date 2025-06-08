
//consultas de resumenes o totales
async function resumenesContarOrdenesSqlServer(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/sqlserver/resumenes/countordenes', {
        method: 'GET',
        onRequestError({ error }) {
            return -1;
        }
    });
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesProductosSqlServer(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/sqlserver/resumenes/productosdiarios', {
        method: 'GET',
        onRequestError({ error }) {
            return -1;
        }
    });
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesProductosFechaSqlServer(): Promise<number>  {
    let start = new Date().getTime();
    let anio = new Date().getFullYear();        
    let mes = Math.floor(Math.random() * 12)+1;
    let dia = Math.floor(Math.random() * 28 + 1);
    let fecha= anio + "," + mes + "," + dia;

    await $fetch(`/api/sqlserver/resumenes/productosdiariosfecha?fecha=${fecha}`, {
        method: 'GET',
        onRequestError({ error }) {
            return -1;
        }
    });
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesTotalDiarioSqlServer() : Promise<number> {
    let start = new Date().getTime();
    await $fetch('/api/sqlserver/resumenes/totaldiario', {
        method: 'GET',
        onRequestError({ error }) {
            return -1;
        }
    });
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function resumenesToptenSqlServer(): Promise<number>  {
    let start = new Date().getTime();
    await $fetch('/api/sqlserver/resumenes/topten', {
        method: 'GET',
        onRequestError({ error }) {
            return -1;
        }
    });
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

export { resumenesContarOrdenesSqlServer, resumenesProductosSqlServer, resumenesProductosFechaSqlServer, resumenesTotalDiarioSqlServer, resumenesToptenSqlServer };