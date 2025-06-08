FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY init-script.js ./

CMD ["node", "init-script.js"]
