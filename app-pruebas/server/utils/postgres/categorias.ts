import pruebas from '../pruebas.json'
//insertando nuevas categorias
async function categoriasInsertar(total: number, inicioId:number): Promise<number> {
    console.log("Iniciando insercion de categorias desde "+inicioId)
    let start = new Date().getTime();    
    for (let i = inicioId; i <= Number(total) + Number(inicioId); i++) {
        //console.log("Tipo de inicioId: ", typeof inicioId);
        //console.log("Tipo de i: ", typeof i);
        //console.log("Tipo de id: ", typeof (inicioId + i));

        const ldata = {
            id: i,
            nombre: "Categoria " + i,
        }
        console.log(`Insertando categoria con id: ${ldata.id}`)
        console.log('Datos del categoria:', JSON.stringify(ldata, null, 2));
        //agrego usando $fetch        
        await $fetch('/api/postgres/categoria', {
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
    await $fetch('/api/postgres/categorias', {
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
async function categoriasConsultarAzar(total:number): Promise<number> {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.categorias.insertar) + 1;
        await $fetch('/api/postgres/categoria/' + id, {
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

async function categoriasActualizar(total:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i + " Actualizada",
        }
        await $fetch('/api/postgres/categoria/'+i, {
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
async function categoriasEliminar(total:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        await $fetch('/api/postgres/categoria/'+i, {
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
