<template>
    <div class="princiapl" >
        <div class="row flex flex-center q-mt-md">
            <div class="text-h4">Pruebas para MariaDB</div>
            
        </div>
        <div class="row" >
            <div class="text-caption col-12 q-ml-md " style="font-size: large;">
                Recuerda que debes tener arrancado el contenedor de MYSQL levantado con docker y no debe tener datos, solo debe tener la estructura de las tablas.
                Haz clic en iniciar y comenzamos las pruebas, primero insertando, luego actualizando, consultando y eliminando.
                Si vuelves ha hacer pruebas se recomienda que ejecutes docker compose down y luego <strong>docker compose up -d</strong> 
                <p>Recuerda que en el archivo <strong>/mysql/docker-compose.yml</strong> defines la memoria y el CPU asignado al contenedor para las pruebas</p>
            </div>
            <div class="col-12 row q-ml-md" >
                <div class="col-2">
                    <div class="text-bold">Pruebas en Categorias</div>
                    Insercion: <strong>{{ pruebas.categorias.insertar }}</strong><br>
                    Actualizacion: <strong>{{ pruebas.categorias.actualizar }}</strong><br>
                    Consulta: <strong>{{ pruebas.categorias.aleatorio }}</strong><br>
                </div>
                <div class="col-2">
                    <div class="text-bold">Pruebas en Productos</div>
                    Insercion: <strong>{{ pruebas.productos.insertar }}</strong><br>
                    Actualizacion: <strong>{{ pruebas.productos.actualizar }}</strong><br>
                    Consulta: <strong>{{ pruebas.productos.aleatorio }}</strong><br>
                </div>
                <div class="col-2">
                    <div class="text-bold">Pruebas en Ordenes</div>
                    Insercion: <strong>{{ pruebas.ordenes.insertar }}</strong><br>
                    Actualizacion: <strong>{{ pruebas.ordenes.actualizar }}</strong><br>
                    Consulta: <strong>{{ pruebas.ordenes.aleatorio }}</strong><br>
                    Detalle Ordenes: <strong>{{ pruebas.ordenes.detalleoden }}</strong><br>
            
                </div>
                <div class="col-3 q-ml-lg">
                    <q-input dense style="width: 150px;" type="number" outlined v-model="contaInicial" label="Contador Inicial en:" />
                <q-input dense style="width: 150px;" outlined v-model="ipServer" label="Servidor nuxt:" />
                    
                    <q-btn size="lg" :loading="cargando" @click="realizarPruebas" color="primary">Iniciar Pruebas</q-btn>
                <q-circular-progress
                show-value
                font-size="12px"
                :value="avance"
                size="50px"
                :thickness="0.22"
                color="teal"
                track-color="grey-3"
                class="q-ma-md"
                >
                {{ avance }}%
                </q-circular-progress>
                <div v-show="errorConexion" class="text-caption text-red">Error de conexion, No es posible conectar con la base de datos revise el host, la ip o si el servicio esta levantado.</div>
            </div>

            </div>
        </div>
        
        <div class="row q-ml-lg q-mt-md">
            <q-table
            flat bordered
            title="Pruebas sobre Gestor MySQL"
            :rows="rows"
            :columns="columns"
            color="primary"
            row-key="name"
            class="col-6"
            
            >            
            </q-table>
           
            <div class="col-2 q-ml-md">
                <div class="text-h6">Errores</div>
                <q-input class="q-my-sm" label="Errores Inserción" outlined v-model="erroresInsercion"  dense>
                    <template v-slot:prepend>
                    <q-icon name="warning" />
                    </template>
                </q-input>
                <q-input class="q-my-sm" label="Errores Consulta" outlined v-model="erroresConsulta"  dense>
                    <template v-slot:prepend>
                    <q-icon name="warning" />
                    </template>
                </q-input>
                <q-input class="q-my-sm" label="Errores Actualización" outlined v-model="erroresActualizacion"  dense>
                    <template v-slot:prepend>
                    <q-icon name="warning" />
                    </template>
                </q-input>
                <q-input class="q-my-sm" label="Errores Eliminación" outlined v-model="erroresEliminacion"  dense>
                    <template v-slot:prepend>
                    <q-icon name="warning" />
                    </template>
                </q-input>
            </div>
            <div class="col-2 q-ml-md">                
                <q-scroll-area style="height: 300px;">
                    <div v-for="n in mensajes" :key="n" class="q-py-xs">
                        {{ n }}
                    </div>
                </q-scroll-area>   
                
            </div>
        </div>
        
    </div>
</template>

<style scoped>
:root {
  --mariadb-deep: #0f272e;       
  --mariadb-teal: #4F8A94;        
  --mariadb-cream: #f0e7d7;      
  --mariadb-muted-orange: #b18245; 
  --mariadb-smoke: #2C4A52;      
}

/* Fondo principal modifique estos para el fondo  */
.princiapl {
  background: linear-gradient(135deg, #1e805a, #6feee3);
  padding: 25px;
  min-height: 100vh;
}

/* Título  */
.text-h4 {
  color: var(--mariadb-deep);
  background: linear-gradient(to right, var(--mariadb-deep), var(--mariadb-smoke));
  padding: 18px;
  border-radius: 14px;
  text-align: center;
  /*Modifique para la sombra del titulo*/
  box-shadow: 
    0 6px 18px rgba(7, 75, 75, 0.25),
    inset 0 1px 0 rgba(32, 143, 22, 0.08);
  border-bottom: 2px solid var(--mariadb-muted-orange);
  font-weight: 600;
  letter-spacing: 0.5px;
}

/*Aqui se cambia el color del fondo de las intrucciones*/
.row:has(.text-caption) {
  background: rgba(45, 167, 156, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(51, 143, 155, 0.3);
  border-radius: 16px;
  padding: 22px;
  margin-top: 25px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
/*Aqui el color del texto de las instrucciones*/ 
.text-caption {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.7;
}

/* Colores y sombras de los bloques de prueba */
[class*="col-"]:has(.text-bold) {
  background: linear-gradient(145deg, #10746b, #1edfe6);
  border-radius: 18px;
  padding: 28px;
  margin: 18px;
  color: var(--mariadb-cream);
  box-shadow: 
    8px 8px 16px rgba(7, 133, 133, 0.3),
    -4px -4px 8px rgba(79, 138, 148, 0.1);
  border-top: 1px solid rgba(79, 138, 148, 0.4);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

[class*="col-"]:has(.text-bold):hover {
  transform: translateY(-6px);
  box-shadow: 
    12px 12px 28px rgba(7, 87, 124, 0.4),
    -6px -6px 12px rgba(13, 102, 117, 0.15);
}

.text-bold {
  font-size: 19px;
  margin-bottom: 18px;
  color: var(--mariadb-cream);
  position: relative;
  padding-bottom: 10px;
}

.text-bold::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, var(--mariadb-cream), transparent);
}

/* Colores del contenedor de iniciar prueba */
.col-3:has(.q-btn) {
  background: rgba(30, 206, 212, 0.9);
  border-radius: 18px;
  padding: 22px;
  border: 1px solid var(--mariadb-teal);
  box-shadow: 
    0 10px 20px rgba(5, 87, 80, 0.2),
    inset 0 0 15px rgba(79, 138, 148, 0.2);
}

.q-btn {
  background: linear-gradient(135deg, var(--mariadb-muted-orange), #000000) !important;
  border-radius: 10px !important;
  font-weight: 600;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 12px rgba(55, 206, 9, 0.3);
}

/* Tabla (Como se la trae de otro lado creo que no furula xd) */
.q-table {
  background: linear-gradient(to bottom, #ff12d7, #223D46);
  border-radius: 16px;
  border: 1px solid var(--mariadb-teal);
  color: var(--mariadb-cream);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Sección errores */
.q-input {
  background: rgba(48, 175, 184, 0.8) !important;
  border-radius: 10px;
  border: 1px solid var(--mariadb-muted-orange) !important;
  color: var(--mariadb-cream) !important;
}

.q-icon[name="warning"] {
  color: var(--mariadb-muted-orange);
  filter: drop-shadow(0 0 4px rgba(236, 232, 227, 0.5));
}

/* Área mensajes */
.q-scroll-area {
  background: rgba(26, 58, 67, 0.8);
  border-radius: 14px;
  padding: 18px;
  border-left: 5px solid var(--mariadb-teal);
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted} from 'vue'

import pruebas from '../server/utils/pruebas.json'
import { categoriasInsertar, categoriasConsultar, categoriasConsultarAzar, categoriasActualizar, categoriasEliminar } from '../server/utils/mariadb/categorias'
import { productosInsertar, productosConsultar, productosConsultarAzar, productosActualizar, productosEliminar } from '../server/utils/mariadb/productos'
import { ordenesInsertar, ordenesConsultarAzar, ordenesActualizar, ordenesEliminar } from '../server/utils/mariadb/ordenes'
import { resumenesContarOrdenes, resumenesProductos, resumenesProductosFecha, resumenesTotalDiario, resumenesTopten } from '../server/utils/mariadb/resumenes'

const errorConexion= ref(false)
const contaInicial= ref(1)
const ipServer= ref('127.0.0.1')

const tiemposInsercion = ref([])
const tiemposConsulta = ref([ ])
const tiemposActualizacion = ref([ ])
const tiemposResumen = ref([ ])
const tiemposEliminacion = ref([])
const erroresInsercion = ref(0)
const erroresConsulta = ref(0)
const erroresActualizacion = ref(0)
const erroresEliminacion = ref(0)
const cargando = ref(false)
const totalPruebas = ref(19)
const mensajes = ref([])

//propiedad computada del porcentaje de pruebas realizadas
const avance = computed(() => {
    return Math.round((tiemposInsercion.value.length + tiemposConsulta.value.length + tiemposActualizacion.value.length + tiemposEliminacion.value.length + tiemposResumen.value.length) / totalPruebas.value * 100)
})

//propiedades para la tabla
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Prueba (Tiempos en segundos)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'total', label: 'Total', field: 'total' },
  { name: 'a', align: 'center', label: 'A', field: 'a' },
  { name: 'b', label: 'B', field: 'b' },
  { name: 'c', label: 'C', field: 'c' },
  { name: 'd', label: 'D', field: 'd' },
  { name: 'e', label: 'E', field: 'e' },
  
]


const rows=computed(() => {
    return [
            {
                name: 'Insertar',
                a: tiemposInsercion.value[0]? tiemposInsercion.value[0]: 0,
                b: tiemposInsercion.value[1]? tiemposInsercion.value[1]: 0,
                c: tiemposInsercion.value[2]? tiemposInsercion.value[2]: 0,
                d: tiemposInsercion.value[3]? tiemposInsercion.value[3]: 0,
                e: tiemposInsercion.value[4]? tiemposInsercion.value[4]: 0, 
                total: tiemposInsercion.value.reduce((a, b) => a + b, 0)/1000
            },
                {
                    name: 'Consultar',
                    a: tiemposConsulta.value[0]? tiemposConsulta.value[0]: 0,
                    b: tiemposConsulta.value[1]? tiemposConsulta.value[1]: 0,
                    c: tiemposConsulta.value[2]? tiemposConsulta.value[2]: 0,
                    d: tiemposConsulta.value[3]? tiemposConsulta.value[3]: 0,
                    e: tiemposConsulta.value[4]? tiemposConsulta.value[4]: 0,
                    total: tiemposConsulta.value.reduce((a, b) => a + b, 0)  /1000
                },
                {
                    name: 'Actualizar',
                    a: tiemposActualizacion.value[0]? tiemposActualizacion.value[0]: 0,
                    b: tiemposActualizacion.value[1]? tiemposActualizacion.value[1]: 0,
                    c: tiemposActualizacion.value[2]? tiemposActualizacion.value[2]: 0,
                    d: tiemposActualizacion.value[3]? tiemposActualizacion.value[3]: 0,
                    e: tiemposActualizacion.value[4]? tiemposActualizacion.value[4]: 0,  
                    total: tiemposActualizacion.value.reduce((a, b) => a + b, 0) /1000 
                },
                {
                    name: 'Resumenes',
                    a: tiemposResumen.value[0]? tiemposResumen.value[0]: 0,
                    b: tiemposResumen.value[1]? tiemposResumen.value[1]: 0,
                    c: tiemposResumen.value[2]? tiemposResumen.value[2]: 0,
                    d: tiemposResumen.value[3]? tiemposResumen.value[3]: 0,
                    e: tiemposResumen.value[4]? tiemposResumen.value[4]: 0,
                    total: tiemposResumen.value.reduce((a, b) => a + b, 0)/1000
                },
                {
                    name: 'Eliminar',
                    a: tiemposEliminacion.value[0]? tiemposEliminacion.value[0]: 0,
                    b: tiemposEliminacion.value[1]? tiemposEliminacion.value[1]: 0,
                    c: tiemposEliminacion.value[2]? tiemposEliminacion.value[2]: 0,
                    d: tiemposEliminacion.value[3]? tiemposEliminacion.value[3]: 0,
                    e: tiemposEliminacion.value[4]? tiemposEliminacion.value[4]: 0,
                    total: tiemposEliminacion.value.reduce((a, b) => a + b, 0)/1000
                },
            ]

    
})

async function probando(){
    try {
        console.log("probando")
        let tiempo:number;
        tiempo=await categoriasConsultar(ipServer.value)
        tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);
        
    } catch (error) {
        console.error(error)
        errorConexion.value=true
    }
}

async function realizarPruebas() {
    try {
        
    cargando.value=true
    totalPruebas.value=19 // son 19 pruebas a realizar
    let tiempo:number;
    
    //INSERTANDO DATOS
    mensajes.value.push("Iniciando pruebas de inserción")    
    tiempo=await categoriasInsertar(pruebas.categorias.insertar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);   
    
    
    tiempo=await productosInsertar(pruebas.productos.insertar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);   
    tiempo=await ordenesInsertar(pruebas.ordenes.insertar, pruebas.ordenes.detalleoden, contaInicial.value, ipServer.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);
    
    mensajes.value.push("Iniciando pruebas de consultas")
    
    //PROCEDEMOS A CONSULTAR LOS DATOS    
    tiempo=await categoriasConsultar(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);
    
    tiempo=await categoriasConsultarAzar(pruebas.categorias.aleatorio, contaInicial.value, ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);
    
    tiempo=await productosConsultar(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    tiempo=await productosConsultarAzar(pruebas.productos.aleatorio,contaInicial.value, ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    // CONSULTAMOS ORDENES AL AZAR DEBEMOS TRAER LOS DATOS DE ORDEN Y SUS DETALLES    
    tiempo=await ordenesConsultarAzar(pruebas.ordenes.aleatorio, contaInicial.value, ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    //ACTUALIZACION DE DATOS
    mensajes.value.push("Iniciando pruebas de actualización")
    
    tiempo=await categoriasActualizar(pruebas.categorias.actualizar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    
    tiempo=await productosActualizar(pruebas.productos.actualizar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    tiempo=await ordenesActualizar(pruebas.ordenes.actualizar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    
    //Consultas de Resumentes o Totales -Avanzadas
    mensajes.value.push("Iniciando pruebas de resumenes")
    tiempo=await resumenesContarOrdenes(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesProductos(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesProductosFecha(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesTotalDiario(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesTopten(ipServer.value)
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);

    //Eliminacion de datos
    mensajes.value.push("Iniciando pruebas de eliminación")
    tiempo=await ordenesEliminar(pruebas.ordenes.insertar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresEliminacion.value++: tiemposEliminacion.value.push(tiempo);
    tiempo=await productosEliminar(pruebas.productos.insertar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresEliminacion.value++: tiemposEliminacion.value.push(tiempo);
    
    tiempo=await categoriasEliminar(pruebas.categorias.insertar, contaInicial.value, ipServer.value)
    tiempo==-1? erroresEliminacion.value++: tiemposEliminacion.value.push(tiempo);

    console.log("Terminaron las pruebas realizadas")
    mensajes.value.push("Terminaron las pruebas realizadas")
    cargando.value=false
    
} catch (error) {
        console.error(error)
    }    
}

async function probarConexion(){
    try {
        console.log("Probando conexión con el servidor: ", ipServer.value);
        await categoriasConsultar(ipServer.value)
        errorConexion.value=false
    } catch (error) {
        errorConexion.value=true
    }
}

onMounted(()=>{
  ipServer.value=window.location.hostname
  probarConexion()
})

</script>

