const mysql = require('mysql') // Este modulo mysql usa sólo callbacks, por tanto no soporta sync await. Pero hay un module de node que permite convertir código de callback a promise o para poder soportarlas. El módulo viene de una biblioteca llamada "util" y el método se llama "promisify" 
const { promisify } = require('util')
const { database } = require('./keys')

// Mysql module además de createConnection tiene otro mas cercano a un entorno de producción llamada createPool()
// createPool() tiene una especie de hilos que se van ejecutando y cada uno va haciendo una tarea a la vez en secuencia. Esto nos ayuda en producción en caso de que tengamos algún fallo. Hace que nuestra app tenga consideración a algunos fallos
const pool = mysql.createPool(database) // Antes de exportar la conección la usamos con método getConnection() para no tener que estar llamandola a cada momento cuando estemos ejecutando el código. De esta manera si queremos hacer consultas a la DB desde otra parte del código, simplemente llamamos al módulo
/* {
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USERNAME,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_DATABASE
} */

pool.getConnection( (err, connection) => {
    if (err) {
        if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {
            console.error('DATABAASE CONNECTION WAS LOST')
        }
        if ( err.code === 'ER_CON_COUNT_ERROR' ) {
            console.error( 'DATABASE HAS TOO MANY CONNECTION' )
        }
        if ( err.code === 'ECONNREFUSED' ) {
            console.error( 'DATABASE CONNECTION WAS REFUSED: ', err )
        }
    } 
    if( connection ) connection.release();
        console.log('DB is connected!')
        return;
})

// Sólo vamos a usar sus métodos que empiecen con query; es decir, cada vez que querramos hacer una query a la DB, vamos a poder usar promesas.
// Promisify Pool Queries para poder usar promesas
pool.query = promisify(pool.query)

module.exports = pool;