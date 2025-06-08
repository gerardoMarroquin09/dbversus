import pruebas from '../pruebas.json'
//insertando nuevas categorias
async function categoriasInsertar(total: number, contaInicial:number): Promise<number> {
    console.log("Iniciando insercion de categorias")
    let start = new Date().getTime();    
      
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i,
        }

        console.log("Simon este es el objeto que se manda")
        console.log(ldata)

        //agrego usando $fetch        
        await $fetch('/api/oracle/categoria', {
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
async function categoriasConsultar(): Promise<number> {    
    let start = new Date().getTime();
    await $fetch('/api/oracle/categorias', {
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
async function categoriasConsultarAzar(total:number, contaInicial:number): Promise<number> {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.categorias.insertar) + Number(contaInicial);
        await $fetch('/api/oracle/categoria/' + id, {
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

async function categoriasActualizar(total:number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i + " Actualizada",
        }
        await $fetch('/api/oracle/categoria/'+i, {
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
async function categoriasEliminar(total:number, contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        await $fetch('/api/oracle/categoria/'+i, {
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
