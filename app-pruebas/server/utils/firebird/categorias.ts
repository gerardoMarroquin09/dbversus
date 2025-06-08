import pruebas from '../pruebas.json'
//insertando nuevas categorias
async function categoriasInsertar(total: number,contaInicial:number): Promise<number> {
    console.log("Iniciando insercion de categorias")
    let start = new Date().getTime();    

    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Categoria " + i,
        }
        //agrego usando $fetch        
        await $fetch('/api/firebird/categoria', {
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

  const response = await $fetch('/api/firebird/categorias', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.statusCode !== 200) {
    throw new Error('Conexión fallida');
  }

  let end = new Date().getTime();
  return end - start;
}



//Consultamos categorias al azar
async function categoriasConsultarAzar(total:number,contaInicial:number ): Promise<number> {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.categorias.insertar) + Number(contaInicial);
        await $fetch('/api/firebird/categoria/' + id, {
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
        await $fetch('/api/firebird/categoria/'+i, {
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
        await $fetch('/api/firebird/categoria/'+i, {
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
