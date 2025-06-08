FROM mcr.microsoft.com/mssql/server:2019-latest

COPY init.sql /init.sql
COPY entrypoint.sh /entrypoint.sh

# No hagas chmod aquí — evita el problema de Windows

# Ejecuta el script directamente con bash
ENTRYPOINT [ "bash", "/entrypoint.sh" ]
