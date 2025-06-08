<template>
  <div>
    <div class="row flex flex-center q-mt-md">
      <div class="text-h4">Pruebas para SQL Server</div>
    </div>

    <div class="row">
      <div class="text-caption col-12 q-ml-md">
        Recuerda que debes tener arrancado el contenedor de SQL Server levantado con Docker y no debe tener datos, solo la estructura de las tablas.<br>
        Haz clic en iniciar y comenzamos las pruebas: inserción, actualización, consulta y eliminación.<br>
        Si vas a repetir pruebas, se recomienda ejecutar <strong>docker compose down</strong> y luego <strong>docker compose up -d</strong>.<br>
        <p>Revisa <strong>/sqlserver/docker-compose.yml</strong> para definir memoria y CPU del contenedor para pruebas.</p>
      </div>

      <div class="col-12 row q-ml-md">
        <div class="col-2">
          <div class="text-bold">Pruebas en Categorías</div>
          Inserción: <strong>{{ pruebas.categorias.insertar }}</strong><br>
          Actualización: <strong>{{ pruebas.categorias.actualizar }}</strong><br>
          Consulta: <strong>{{ pruebas.categorias.aleatorio }}</strong><br>
        </div>

        <div class="col-2">
          <div class="text-bold">Pruebas en Productos</div>
          Inserción: <strong>{{ pruebas.productos.insertar }}</strong><br>
          Actualización: <strong>{{ pruebas.productos.actualizar }}</strong><br>
          Consulta: <strong>{{ pruebas.productos.aleatorio }}</strong><br>
        </div>

        <div class="col-2">
          <div class="text-bold">Pruebas en Órdenes</div>
          Inserción: <strong>{{ pruebas.ordenes.insertar }}</strong><br>
          Actualización: <strong>{{ pruebas.ordenes.actualizar }}</strong><br>
          Consulta: <strong>{{ pruebas.ordenes.aleatorio }}</strong><br>
          Detalle Órdenes: <strong>{{ pruebas.ordenes.detalleoden }}</strong><br>
        </div>
        
        <div class="col-3 q-ml-lg">
          <q-input dense style="width: 150px;" type="number" outlined v-model="contaInicial" label="Contador Inicial en:" />
          
          <q-btn :disable="errorConexion" size="lg" :loading="cargando" @click="realizarPruebas" color="primary">Iniciar Pruebas</q-btn>
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
        title="Pruebas sobre Gestor SQL Server"
        :rows="rows"
        :columns="columns"
        color="primary"
        row-key="name"
        class="col-6"
      />

      <div class="col-2 q-ml-md">
        <div class="text-h6">Errores</div>
        <q-input class="q-my-sm" label="Errores Inserción" outlined v-model="erroresInsercion" dense>
          <template v-slot:prepend><q-icon name="warning" /></template>
        </q-input>
        <q-input class="q-my-sm" label="Errores Consulta" outlined v-model="erroresConsulta" dense>
          <template v-slot:prepend><q-icon name="warning" /></template>
        </q-input>
        <q-input class="q-my-sm" label="Errores Actualización" outlined v-model="erroresActualizacion" dense>
          <template v-slot:prepend><q-icon name="warning" /></template>
        </q-input>
        <q-input class="q-my-sm" label="Errores Eliminación" outlined v-model="erroresEliminacion" dense>
          <template v-slot:prepend><q-icon name="warning" /></template>
        </q-input>
      </div>

      <div class="col-2 q-ml-md">
        <q-scroll-area style="height: 300px;">
          <div v-for="(msg, index) in mensajes" :key="index" class="q-py-xs">
            {{ msg }}
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import pruebas from '../server/utils/pruebas.json'
import { categoriasInsertarSqlServer, categoriasConsultarSqlServer, categoriasConsultarAzarSqlServer, categoriasActualizarSqlServer, categoriasEliminarSqlServer } from '../server/utils/sqlserver/categorias'
import { productosInsertarSqlServer, productosConsultarSqlServer, productosConsultarAzarSqlServer, productosActualizarSqlServer, productosEliminarSqlServer } from '../server/utils/sqlserver/productos'
import { ordenesInsertarSqlServer, ordenesConsultarAzarSqlServer, ordenesActualizarSqlServer, ordenesEliminarSqlServer } from '../server/utils/sqlserver/ordenes'
import { resumenesContarOrdenesSqlServer, resumenesProductosSqlServer, resumenesProductosFechaSqlServer, resumenesTotalDiarioSqlServer, resumenesToptenSqlServer } from '../server/utils/sqlserver/resumenes'

const errorConexion= ref(false)
const contaInicial= ref(1)

const tiemposInsercion = ref<number[]>([])
const tiemposConsulta = ref<number[]>([])
const tiemposActualizacion = ref<number[]>([])
const tiemposResumen = ref<number[]>([])
const tiemposEliminacion = ref<number[]>([])

const erroresInsercion = ref(0)
const erroresConsulta = ref(0)
const erroresActualizacion = ref(0)
const erroresEliminacion = ref(0)

const cargando = ref(false)
const totalPruebas = ref(19)
const mensajes = ref<string[]>([])

const avance = computed(() => {
  const total = tiemposInsercion.value.length + tiemposConsulta.value.length + tiemposActualizacion.value.length + tiemposEliminacion.value.length + tiemposResumen.value.length
  return Math.round((total / totalPruebas.value) * 100)
})

const columns = [
  { name: 'name', label: 'Prueba (Tiempos en segundos)', align: 'left', field: row => row.name, sortable: true },
  { name: 'total', label: 'Total', field: 'total' },
  { name: 'a', label: 'A', field: 'a' },
  { name: 'b', label: 'B', field: 'b' },
  { name: 'c', label: 'C', field: 'c' },
  { name: 'd', label: 'D', field: 'd' },
  { name: 'e', label: 'E', field: 'e' }
]

const rows = computed(() => {
  const formats = (arr: number[]) => ({
    a: arr[0] || 0, b: arr[1] || 0, c: arr[2] || 0, d: arr[3] || 0, e: arr[4] || 0,
    total: arr.reduce((a, b) => a + b, 0) / 1000
  })
  return [
    { name: 'Insertar', ...formats(tiemposInsercion.value) },
    { name: 'Consultar', ...formats(tiemposConsulta.value) },
    { name: 'Actualizar', ...formats(tiemposActualizacion.value) },
    { name: 'Resumenes', ...formats(tiemposResumen.value) },
    { name: 'Eliminar', ...formats(tiemposEliminacion.value) }
  ]
})

async function realizarPruebas() {
  try {
    cargando.value = true
    mensajes.value.push("Iniciando pruebas de inserción")

    let tiempo = await categoriasInsertarSqlServer(pruebas.categorias.insertar, contaInicial.value)
    tiempo === -1 ? erroresInsercion.value++ : tiemposInsercion.value.push(tiempo)

    tiempo = await productosInsertarSqlServer(pruebas.productos.insertar, contaInicial.value)
    tiempo === -1 ? erroresInsercion.value++ : tiemposInsercion.value.push(tiempo)

    tiempo = await ordenesInsertarSqlServer(pruebas.ordenes.insertar, pruebas.ordenes.detalleoden, contaInicial.value)
    tiempo === -1 ? erroresInsercion.value++ : tiemposInsercion.value.push(tiempo)

    mensajes.value.push("Iniciando pruebas de consultas")

    tiempo = await categoriasConsultarSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposConsulta.value.push(tiempo)

    tiempo = await categoriasConsultarAzarSqlServer(pruebas.categorias.aleatorio, contaInicial.value)
    tiempo === -1 ? erroresConsulta.value++ : tiemposConsulta.value.push(tiempo)

    tiempo = await productosConsultarSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposConsulta.value.push(tiempo)

    tiempo = await productosConsultarAzarSqlServer(pruebas.productos.aleatorio, contaInicial.value)
    tiempo === -1 ? erroresConsulta.value++ : tiemposConsulta.value.push(tiempo)

    tiempo = await ordenesConsultarAzarSqlServer(pruebas.ordenes.aleatorio, contaInicial.value)
    tiempo === -1 ? erroresConsulta.value++ : tiemposConsulta.value.push(tiempo)

    mensajes.value.push("Iniciando pruebas de actualización")

    tiempo = await categoriasActualizarSqlServer(pruebas.categorias.actualizar, contaInicial.value)
    tiempo === -1 ? erroresActualizacion.value++ : tiemposActualizacion.value.push(tiempo)

    tiempo = await productosActualizarSqlServer(pruebas.productos.actualizar, contaInicial.value)
    tiempo === -1 ? erroresActualizacion.value++ : tiemposActualizacion.value.push(tiempo)

    tiempo = await ordenesActualizarSqlServer(pruebas.ordenes.actualizar, contaInicial.value)
    tiempo === -1 ? erroresActualizacion.value++ : tiemposActualizacion.value.push(tiempo)

    mensajes.value.push("Iniciando pruebas de resumenes")

    tiempo = await resumenesContarOrdenesSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposResumen.value.push(tiempo)

    tiempo = await resumenesProductosSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposResumen.value.push(tiempo)

    tiempo = await resumenesProductosFechaSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposResumen.value.push(tiempo)

    tiempo = await resumenesTotalDiarioSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposResumen.value.push(tiempo)

    tiempo = await resumenesToptenSqlServer()
    tiempo === -1 ? erroresConsulta.value++ : tiemposResumen.value.push(tiempo)

    mensajes.value.push("Iniciando pruebas de eliminación")

    tiempo = await ordenesEliminarSqlServer(pruebas.ordenes.insertar, contaInicial.value)
    tiempo === -1 ? erroresEliminacion.value++ : tiemposEliminacion.value.push(tiempo)

    tiempo = await productosEliminarSqlServer(pruebas.productos.insertar, contaInicial.value)
    tiempo === -1 ? erroresEliminacion.value++ : tiemposEliminacion.value.push(tiempo)

    tiempo = await categoriasEliminarSqlServer(pruebas.categorias.insertar, contaInicial.value)
    tiempo === -1 ? erroresEliminacion.value++ : tiemposEliminacion.value.push(tiempo)

    mensajes.value.push("Terminaron las pruebas realizadas")
    cargando.value = false

  } catch (error) {
    console.error(error)
    mensajes.value.push("Ocurrió un error crítico durante la ejecución")
    cargando.value = false
  }
}
</script>
