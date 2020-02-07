// Modulo handlebars vamos a usar de vez en cuando algunas funciones. ESAS FUNICIONES LAS VAMMOS A definir dentro de la carpeta lib/handlebars.js.
// Si por ejemplo queremos procesar algunas fechas, no podemos ejecutar una función dentro de handlebars. Tenemos que hacerlo por parte a traves de helpers
const { format } = require('timeago.js') // Importamos método format de timeago

const helpers = {} // Creamos un objeto que vamos a poder utilizar desde las vistas

// Dentro del objeto helpers vamos a crear por nosotros mismos un método al que le vamos a llamar timeago que va a recibir como parámetro un timestamp que guarda la base de datos mysql, una fecha ilegible o compleja de leer.
// Ese fecha la vamos a convertir por ej: "3 días atrás, dos días atras ..." con el método format()
helpers.timeago = (timestamp) => {
    return format(timestamp)
}

module.exports = helpers