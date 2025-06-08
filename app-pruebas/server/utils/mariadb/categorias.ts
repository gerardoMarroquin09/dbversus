import pruebas from '../pruebas.json'
//insertando nuevas categorias
async function categoriasInsertar(total: number, contaInicial:number, ipServer:string): Promise<number> {
    console.log("Iniciando insercion de categorias")
    let start = new Date().getTime();    
      
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i,
        }
        //agrego usando $fetch        
        await $fetch('http://'+ ipServer+':3000/api/mariadb/categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ldata),            
            onRequestError({ request, options, error }) {
                return -1;
            },
        })        
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

//Consultando todas las categorias
async function categoriasConsultar(ipServer:string): Promise<number> {    
    let start = new Date().getTime();
    await $fetch('http://'+ ipServer+':3000/api/mariadb/categorias', {
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

//Consultamos categorias al azar
async function categoriasConsultarAzar(total:number, contaInicial:number, ipServer:string): Promise<number> {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.categorias.insertar) + Number(contaInicial);
        await $fetch('http://'+ ipServer+':3000/api/mariadb/categoria/' + id, {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json',
            },
            onRequestError({ request, options, error }) {
                return -1;
            },
        })        
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function categoriasActualizar(total:number, contaInicial:number, ipServer:string): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i + " Actualizada",
        }
        await $fetch('http://'+ ipServer+':3000/api/mariadb/categoria/'+i, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ldata),
            onRequestError({ request, options, error }) {
                return -1;
            },
        })        
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

//eliminando las categorias
async function categoriasEliminar(total:number, contaInicial:number, ipServer:string): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        await $fetch('http://'+ ipServer+':3000/api/mariadb/categoria/'+i, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: i }),
        onRequestError({ request, options, error }) {
            return -1;
        }
        })  
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

export { categoriasInsertar, categoriasConsultar, categoriasConsultarAzar, categoriasActualizar, categoriasEliminar }
