import pruebas from '../pruebas.json'
async function ordenesInsertar(total:number, totaldetalle:number, contaInicial:number): Promise<number> {
    console.log("Iniciando insercion de ordenes")
    let start = new Date().getTime();
    for (let conta=contaInicial; conta<=Number(total) + Number(contaInicial); conta ++){
        let anio = new Date().getFullYear();
        //mes es un numero del 1 al 12
        let mes = Math.floor(Math.random() * 12)+1;
        let lfecha: string = anio +","+ mes + "," + Math.floor(Math.random() * 28 + 1);
        const ldata = {
                id: conta,
                fecha:lfecha,
                total: Math.floor(Math.random() * 100) + 1,
        }
        //agrego usando $fetch        
        await $fetch('/api/oracle/orden', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ldata),
                onRequestError({ request, options, error }) {
                    return -1;
                },
                onResponse({ response }) {
                    
                },                       
                
            })
            
        //ahora vienen los detalles de cada orden
        await detalleOrdenInsertar(conta, totaldetalle, contaInicial)
    }//fin del for del conta de las ordenes
   
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function detalleOrdenInsertar(idOrden: number, totaldetalle: number, contaInicial:number) {   
                //Ahora Agregamos los detalles de la orden los cuales serán segun el totaldetalle
                for (let j = contaInicial; j <= Number(totaldetalle) + Number(contaInicial) ; j++) {
                    const ldatadetalle = {                        
                        idorden: idOrden,
                        //idproducto: Math.floor(Math.random() * (pruebas.productos.insertar/2)) + 1,
                        idproducto:j,
                        cantidad: Math.floor(Math.random() * 10) + 1,
                        precio: Math.floor(Math.random() * 100) + 1,
                    }
                    //agrego usando $fetch        
                    await $fetch('/api/oracle/detalleorden', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(ldatadetalle),            
                        onRequestError({ request, options, error }) {
                            
                        },
                    })        
                }
}

async function ordenesConsultarAzar(total:number, contaInicial:number): Promise<number> {    
    let start = new Date().getTime();
    for (let i = 1; i <= total; i++) {
        let id = Math.floor(Math.random() * pruebas.ordenes.insertar) + Number(contaInicial);
        await $fetch('/api/oracle/orden/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },           
            onRequestError({ request, options, error }) {
                return -1
            },
        })
        //ahora consultamos los detalles de la orden
        await $fetch('/api/oracle/detalleorden/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },           
            onRequestError({ request, options, error }) {
                erroresConsulta.value++
            },
        })        
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function ordenesActualizar(total:number,contaInicial:number): Promise<number> {
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        const ldata = {
            id: i,
            fecha: new Date().toISOString(),
            total: Math.floor(Math.random() * 100) + 1,
        }
        await $fetch('/api/oracle/orden/'+i, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ldata),
            onRequestError({ request, options, error }) {
                return -1;
            },
        })
        //ahora actualizamos los detalles de la orden, primero hacemos GET y traemos todos los detalles
        // luego le multiplicamos por dos la cantidad y enviamos las actualizaciones de cada detalle
        let datos = await $fetch('/api/oracle/detalleorden/' + i, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },           
            onRequestError({ request, options, error }) {
                erroresConsulta.value++
            },
        })
        //console.log (datos.data)
        //return       
        //convertir a json datos.data
        let ldatos = datos.data
        //console.log(ldatos)
        for (let j = 0; j < ldatos.length; j++) {
            const ldatadetalle = {                        
                idorden: i,
                idproducto: ldatos[j].idproducto,
                cantidad: ldatos[j].cantidad * 2,
                precio: ldatos[j].precio,
            }
            //console.log(ldatadetalle)
            //ahora invocamos PUT detalleorden para enviar los cambios
            await $fetch('/api/oracle/detalleorden/' + ldatos[j].idorden + '/'+  ldatos[j].idproducto  , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ldatadetalle),            
                onRequestError({ request, options, error }) {
                    return -1;
                },
            })     
        } //fin del for de los detalles        

        
    }
    let end = new Date().getTime();
    let time = end - start;
    return time;
}

async function ordenesEliminar(total:number, contaInicial:number) : Promise<number>{
    let start = new Date().getTime();
    for (let i = contaInicial; i <= Number(total) + Number(contaInicial); i++) {
        
        await $fetch('/api/oracle/orden/'+i, {
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

export { ordenesInsertar, ordenesConsultarAzar, ordenesActualizar, ordenesEliminar }