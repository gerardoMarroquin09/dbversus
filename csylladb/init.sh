#!/bin/bash

# Iniciar ScyllaDB
/docker-entrypoint.py --developer-mode=1 &

# Esperar a que ScyllaDB esté completamente listo
echo "Esperando a que ScyllaDB esté listo..."
sleep 30

# Intentar ejecutar el archivo CQL hasta que ScyllaDB esté listo
until cqlsh -f /init.cql; do
    echo "ScyllaDB no está listo aún, reintentando en 10 segundos..."
    sleep 10
done

# Mantener el contenedor corriendo
wait