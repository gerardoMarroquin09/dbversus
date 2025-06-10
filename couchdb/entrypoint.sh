#!/bin/bash
set -e

COUCHDB_URL="http://admin:password@localhost:5984"

# Función para verificar si CouchDB está disponible
check_couchdb() {
  echo "Esperando a que CouchDB esté disponible..."
  until curl -s "$COUCHDB_URL/_up" | grep -q '"status":"ok"'; do
    sleep 1
  done
  echo "CouchDB está disponible."
}

# Inicia CouchDB en background y guarda el PID
echo "Iniciando CouchDB en primer plano..."
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
COUCHDB_PID=$!

# Espera que CouchDB esté listo
check_couchdb

# Ejecuta el script de inicialización si existe
if [ -f /init-couchdb.sh ]; then
  echo "Ejecutando script de inicialización..."
  chmod +x /init-couchdb.sh
  # Ejecuta y captura cualquier error para no detener el proceso
  if ! /init-couchdb.sh; then
    echo "Advertencia: Error al ejecutar /init-couchdb.sh, pero se continúa."
  fi
else
  echo "No se encontró /init-couchdb.sh, omitiendo inicialización."
fi

# Mantiene el proceso de CouchDB en primer plano
wait $COUCHDB_PID