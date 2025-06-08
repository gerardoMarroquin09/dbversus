FROM node:21.7.3-alpine AS build
WORKDIR /codigo
COPY ["package.json", "package-lock.json*", "./"]
 # instala dependencias clear install
RUN npm ci
#copiamos todos los archivos de la carpeta actual excepto node_modules
# que se excluye por el archivo .dockerignore
COPY . .
RUN npm run build
FROM node:21.7.3-alpine AS production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --omit=dev
COPY --from=build /codigo/.output /app
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
CMD ["node", "/app/server/index.mjs"]
#en codigo se definen variables de entorno para referir a la base de datos
#leer el readme para mas informacion

#sudo docker build -t calderonperaza/dbversusapp:1.0 .
#sudo docker build --no-cache -t calderonperaza/dbversusapp:1.0 .
