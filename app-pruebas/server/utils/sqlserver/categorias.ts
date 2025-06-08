import pruebas from '../pruebas.json';

async function categoriasInsertarSqlServer(total: number, contaInicial:number): Promise<number> {
    console.log("Iniciando inserción de categorías");
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoría " + i,
        };
        try {
            await $fetch('/api/sqlserver/categoria', { 
                method: 'POST',
                body: ldata
            });
        } catch (error) {
            console.error(`Error en la inserción de categoría ${i}:`, error);
        }
    }
    let end = new Date().getTime();
    return end - start;
}

async function categoriasConsultarSqlServer(): Promise<number> {
    let start = new Date().getTime();
    try {
        await $fetch('/api/sqlserver/categoria', { 
            method: 'POST'
        });
    } catch (error) {
        console.error("Error al consultar categorías:", error);
    }
    let end = new Date().getTime();
    return end - start;
}

async function categoriasConsultarAzarSqlServer(total: number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    if (!pruebas?.categorias?.insertar || pruebas.categorias.insertar <= 0) {
        console.error("Error: No hay registros en pruebas.categorias.insertar");
        return -1;
    }
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        let id = Math.floor(Math.random() * pruebas.categorias.insertar) + Number(contaInicial);
        try {
            await $fetch(`/api/sqlserver/categoria/${id}`, { 
                method: 'GET'
            });
        } catch (error) {
            console.error(`Error al consultar categoría ${id}:`, error);
        }
    }
    let end = new Date().getTime();
    return end - start;
}

async function categoriasEliminarSqlServer(total: number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        try {
            await $fetch(`/api/sqlserver/categoria/${i}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Error al eliminar categoría ${i}:`, error);
        }
    }
    let end = new Date().getTime();
    return end - start;
}

async function categoriasActualizarSqlServer(total: number, contaInicial:number): Promise<number> {
    console.log("Iniciando actualización de categorías");
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            nombre: "Categoría Actualizada " + i
        };
        try {
            await $fetch(`/api/sqlserver/categoria/${i}`, {
                method: 'PUT',
                body: ldata
            });
        } catch (error) {
            console.error(`Error actualizando categoría ${i}:`, error);
        }
    }
    let end = new Date().getTime();
    return end - start;
}


export { categoriasInsertarSqlServer, categoriasConsultarSqlServer, categoriasConsultarAzarSqlServer, categoriasEliminarSqlServer, categoriasActualizarSqlServer };