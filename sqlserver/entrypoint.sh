#!/bin/bash

/opt/mssql/bin/sqlservr &

echo "Esperando que SQL Server esté listo..."
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "SELECT 1" &> /dev/null
do
  sleep 1
done

echo "SQL Server está listo. Ejecutando init.sql..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -i /init.sql

wait
