import Firebird from 'node-firebird';

const options = {
 host: process.env.HOST_DB || 'localhost', // 'firebird' en Docker
  port: 3050, // no 3051 (eso es para acceso desde el HOST, no entre contenedores)
  database: '/var/lib/firebird/data/cafeteria.fdb', // solo el nombre del archivo
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
  retryConnectionInterval: 1000,
  blobAsText: false,
  encoding: 'UTF8',
  wireCrypt: true, 
};

// Función auxiliar para conectarse a la base de datos y ejecutar una consulta
function withConnection() {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, (err, db) => {
      if (err) {
        reject('Error al conectar: ' + err);
      } else {
        resolve(db);
      }
    });
  });
}

// Clase Categorias con métodos findAll y findOne


export { withConnection };