import pruebas from '../pruebas.json'

async function productosInsertar(total: number, contaInicial:number): Promise<number>  { 
    console.log("Iniciando insercion de productos")   
    let start = new Date().getTime();

    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Producto " + i,
            precio: Math.floor(Math.random() * 100) + 1,
            idCategoria: Math.floor(Math.random() * pruebas.categorias.insertar) + Number(contaInicial),
        }
        //agrego usando $fetch        
        await $fetch('/api/oracle/producto', {
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

async function productosConsultar(): Promise<number>  {    
    let start = new Date().getTime();
    await $fetch('/api/oracle/productos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequestError({ request, options, error }) {
            return -1
        },
    })
    let end = new Date().getTime();
    let time = end - start;
    return time;       
}

async function productosConsultarAzar(total:number, contaInicial:number): Promise<number>  {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.productos.insertar) + Number(contaInicial);
        await $fetch('/api/oracle/producto/' + id, {
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

async function productosActualizar(total:number, contaInicial:number): Promise<number>  {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            nombre: "Producto " + i + " Actualizado",
            precio: Math.floor(Math.random() * 100) + 1,
            categoria: Math.floor(Math.random() * pruebas.categorias.insertar) + 1,
        }

        await $fetch('/api/oracle/producto/'+i, {
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

async function productosEliminar(total:number, contaInicial:number): Promise<number>  {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        await $fetch('/api/oracle/producto/'+i, {
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

export { productosInsertar, productosConsultar, productosConsultarAzar, productosActualizar, productosEliminar }