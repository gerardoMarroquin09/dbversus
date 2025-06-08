<template>
    <div class="q-pa-md" style="background-color: #f5f5f5">
      <!-- Banner Oracle -->
      <q-banner class="bg-red-10 text-white q-pa-md" rounded>
        <template v-slot:avatar>
          <q-icon name="storage" size="md" />
        </template>
        <div class="text-h5">Pruebas para Oracle</div>
      </q-banner>
  
      <!-- Instrucciones -->
      <q-card class="q-mt-md q-pa-md">
        <div class="text-subtitle1 q-mb-sm">Instrucciones</div>
        <div class="text-body2">
          Asegúrate de que el contenedor Docker de Oracle esté activo y con solo la estructura de las tablas.
          Haz clic en <strong>Iniciar</strong> para comenzar las pruebas de inserción, actualización, consulta y eliminación.
          <br><br>
          Si deseas repetir las pruebas, ejecuta: 
          <code>docker compose down</code> y luego <code>docker compose up -d</code>.
          <p>Configura la memoria y CPU en <strong>/oracle/docker-compose.yml</strong>.</p>
        </div>
      </q-card>
  
      <!-- Estado de pruebas -->
      <q-card class="q-mt-md q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <div class="text-bold text-primary">Pruebas en Categorías</div>
            <div>Inserción: <strong>{{ pruebas.categorias.insertar }}</strong></div>
            <div>Actualización: <strong>{{ pruebas.categorias.actualizar }}</strong></div>
            <div>Consulta: <strong>{{ pruebas.categorias.aleatorio }}</strong></div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-bold text-primary">Pruebas en Productos</div>
            <div>Inserción: <strong>{{ pruebas.productos.insertar }}</strong></div>
            <div>Actualización: <strong>{{ pruebas.productos.actualizar }}</strong></div>
            <div>Consulta: <strong>{{ pruebas.productos.aleatorio }}</strong></div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-bold text-primary">Pruebas en Órdenes</div>
            <div>Inserción: <strong>{{ pruebas.ordenes.insertar }}</strong></div>
            <div>Actualización: <strong>{{ pruebas.ordenes.actualizar }}</strong></div>
            <div>Consulta: <strong>{{ pruebas.ordenes.aleatorio }}</strong></div>
            <div>Detalle: <strong>{{ pruebas.ordenes.detalleoden }}</strong></div>
          </div>
          <div class="col-12 col-md-3">
            <q-input dense type="number" outlined v-model="contaInicial" label="Contador Inicial" />
            <q-btn
              :disable="errorConexion"
              color="red-10"
              size="md"
              class="q-mt-sm full-width"
              :loading="cargando"
              @click="realizarPruebas"
              icon="play_arrow"
              label="Iniciar Pruebas"
            />
            <q-circular-progress
              show-value
              font-size="12px"
              :value="avance"
              size="50px"
              :thickness="0.22"
              color="teal"
              track-color="grey-3"
              class="q-mt-sm"
            >
              {{ avance }}%
            </q-circular-progress>
  
            <div v-show="errorConexion" class="text-caption text-red q-mt-sm">
              Error de conexión. Verifica el host, IP o si el servicio Oracle está activo.
            </div>
          </div>
        </div>
      </q-card>
  
      <!-- Resultados -->
      <div class="row q-mt-lg">
        <!-- Tabla -->
        <div class="col-12 col-md-7">
          <q-card>
            <q-table
              flat
              bordered
              title="Pruebas sobre Oracle DB"
              :rows="rows"
              :columns="columns"
              row-key="name"
              color="red-10"
              dense
            />
          </q-card>
        </div>
  
        <!-- Errores -->
        <div class="col-12 col-md-2 q-ml-md">
          <q-card class="q-pa-sm">
            <div class="text-h6 text-negative">Errores</div>
            <q-input class="q-my-xs" label="Inserción" outlined v-model="erroresInsercion" dense>
              <template v-slot:prepend>
                <q-icon name="warning" />
              </template>
            </q-input>
            <q-input class="q-my-xs" label="Consulta" outlined v-model="erroresConsulta" dense>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-input class="q-my-xs" label="Actualización" outlined v-model="erroresActualizacion" dense>
              <template v-slot:prepend>
                <q-icon name="update" />
              </template>
            </q-input>
            <q-input class="q-my-xs" label="Eliminación" outlined v-model="erroresEliminacion" dense>
              <template v-slot:prepend>
                <q-icon name="delete" />
              </template>
            </q-input>
          </q-card>
        </div>

  
        <!-- Mensajes -->
        <div class="col-12 col-md-2 q-ml-md">
          <q-card class="q-pa-sm">
            <div class="text-h6">Mensajes</div>
            <q-scroll-area style="height: 180px;">
              <div v-for="n in mensajes" :key="n" class="q-py-xs">
                {{ n }}
              </div>
            </q-scroll-area>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-lg">
  <div class="col-12">
    <q-card class="flex flex-center q-pa-lg" style="height: 100px;">
      <q-img
        src="https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg"
        alt="Oracle"
        style="max-width: 300px; max-height: 100px;"
        fit="contain"
      />
    </q-card>
  </div>
</div>
    </div>
  </template>
  

<script setup lang="ts">
import { ref, computed, onMounted} from 'vue'


import pruebas from '../server/utils/pruebas.json'
import { categoriasInsertar, categoriasConsultar, categoriasConsultarAzar, categoriasActualizar, categoriasEliminar } from '../server/utils/oracle/categorias'
import { productosInsertar, productosConsultar, productosConsultarAzar, productosActualizar, productosEliminar } from '../server/utils/oracle/productos'
import { ordenesInsertar, ordenesConsultarAzar, ordenesActualizar, ordenesEliminar } from '../server/utils/oracle/ordenes'
import { resumenesContarOrdenes, resumenesProductos, resumenesProductosFecha, resumenesTotalDiario, resumenesTopten } from '../server/utils/oracle/resumenes'

const errorConexion= ref(false)
const contaInicial= ref(1)

const tiemposInsercion= ref([])
const tiemposConsulta= ref([ ])
const tiemposActualizacion= ref([ ])
const tiemposResumen= ref([ ])
const tiemposEliminacion= ref([])
const erroresInsercion= ref(0)
const erroresConsulta= ref(0)
const erroresActualizacion= ref(0)
const erroresEliminacion= ref(0)
const cargando= ref(false)
const totalPruebas= ref(19)
const mensajes= ref([])

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
  { name: 'a', label: 'A', field: 'a' },
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



async function realizarPruebas() {
    try {
        
    cargando.value=true
    totalPruebas.value=19 // son 19 pruebas a realizar
    let tiempo:number;
    
    //INSERTANDO DATOS
    mensajes.value.push("Iniciando pruebas de inserción")    
    
    tiempo=await categoriasInsertar(pruebas.categorias.insertar, contaInicial.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);   
    
    
    tiempo=await productosInsertar(pruebas.productos.insertar, contaInicial.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);   
    tiempo=await ordenesInsertar(pruebas.ordenes.insertar, pruebas.ordenes.detalleoden, contaInicial.value)
    tiempo==-1? erroresInsercion.value++: tiemposInsercion.value.push(tiempo);
    
    mensajes.value.push("Iniciando pruebas de consultas")
    
    //PROCEDEMOS A CONSULTAR LOS DATOS    
    tiempo=await categoriasConsultar()
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);
    
    tiempo=await categoriasConsultarAzar(pruebas.categorias.aleatorio, contaInicial.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);
    
    tiempo=await productosConsultar()
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    tiempo=await productosConsultarAzar(pruebas.productos.aleatorio,contaInicial.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    // CONSULTAMOS ORDENES AL AZAR DEBEMOS TRAER LOS DATOS DE ORDEN Y SUS DETALLES    
    tiempo=await ordenesConsultarAzar(pruebas.ordenes.aleatorio, contaInicial.value)
    tiempo==-1? erroresConsulta.value++: tiemposConsulta.value.push(tiempo);

    //ACTUALIZACION DE DATOS
    mensajes.value.push("Iniciando pruebas de actualización")
    
    tiempo=await categoriasActualizar(pruebas.categorias.actualizar, contaInicial.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    
    tiempo=await productosActualizar(pruebas.productos.actualizar, contaInicial.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    tiempo=await ordenesActualizar(pruebas.ordenes.actualizar, contaInicial.value)
    tiempo==-1? erroresActualizacion.value++: tiemposActualizacion.value.push(tiempo);
    
    //Consultas de Resumentes o Totales -Avanzadas
    mensajes.value.push("Iniciando pruebas de resumenes")
    tiempo=await resumenesContarOrdenes()
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesProductos()
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesProductosFecha()
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesTotalDiario()
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);
    tiempo=await resumenesTopten()
    tiempo==-1? erroresConsulta.value++: tiemposResumen.value.push(tiempo);

    //Eliminacion de datos
    
    mensajes.value.push("Iniciando pruebas de eliminación")
    tiempo=await ordenesEliminar(pruebas.ordenes.insertar, contaInicial.value)
    tiempo==-1? erroresEliminacion.value++: tiemposEliminacion.value.push(tiempo);
    tiempo=await productosEliminar(pruebas.productos.insertar, contaInicial.value)
    tiempo==-1? erroresEliminacion.value++: tiemposEliminacion.value.push(tiempo);
    
    tiempo=await categoriasEliminar(pruebas.categorias.insertar, contaInicial.value)
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
        await categoriasConsultar()
        errorConexion.value=false
    } catch (error) {
        errorConexion.value=true
    }
}

onMounted(()=>{
    probarConexion()
})

</script>