
// entorno de desarrollo 

// import rethink from 'rethinkdb';
// async function connect() {
//     const host = 'localhost';
//     return await rethink.connect({ host, port: 28015, db: 'cafeteria' });
// }

// export { connect, rethink };


// entorno de produccion

import rethink from 'rethinkdb';
async function connect() {
  const host = process.env.HOST_DB || 'localhost';
  return await rethink.connect({
    host,
    port: 28015,
    db: 'cafeteria'
  });
}

export { connect, rethink };

// comando para obtener la ip 
// ip a | grep inet
// se busca la 192.168.x.x

// ACTUALIZACION PARA EL ENTORNO DE PRODUCCION => AHORA SOLO EJECUTAMOS sudo docker compose up -d --build desde la carpeta raiz del proyecto app y se nos crearan las imagenes, junto a los contenedores correspondientes