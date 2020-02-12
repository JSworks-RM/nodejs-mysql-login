// Passport también nos permite realizar autenticaciones con medios sociales a través de twitter, google, facebook, entre otros.
// En nuestro caso la heremos de manera local con nuestra base de datos usando el módulo passport-local
const passport = require('passport') // Indicaremos que tipo de autenticación queremos
const LocalStrategy = require('passport-local').Strategy
const poolDB = require('../database')

const helpers = require('../lib/helpers')

// Al tener estos dos módulos (passport y passport-local), ya podemos hacer nuestras autenticaciones
// Para poder usar toda esta lógica de autenticación debemos llamarla desde algún sitio. 
// El encargado de ejecutar esta autenticación va a ser la ruta signup que tenemos en las routes
passport.use('local.signup', new LocalStrategy (
    {
        usernameField: 'username', // Campo del que vamos a recibir el dato
        passwordField: 'password',
        passReqToCallback: true // Para poder recibir el objeto dentro de la función que ejecuta este local strategy

    }, async (req, username, password, done) => {
    
        const { fullname } = req.body
        const newUser = {
            username: username,
            password,
            fullname
        }
        newUser.password = await helpers.encriptPassword(password) // Enviamos password al método que nos retornará cifrará la contraseña
        const sql = 'INSERT INTO users set ?'
        const result = await poolDB.query( sql, [newUser] )
        newUser.id = result.insertId
        return done(null, newUser)

    } ) )

// Con serializeUser() guardamos id de ese usuario
passport.serializeUser((user, done) => {
    return done(null, user.id)
})

// Con deserializeUser() obtenemos los datos almacenados con ese id
passport.deserializeUser( async (id, done) => {
    const row = await poolDB.query('SELECT * FROM users WHERE id = ?', id)
    return done(null, row[0])
})


// La doc de passport nos indica que hay que definir dos partes de passport: Una para serializar al usuario y otra para deserializarlo
// Es un proceso de como passport va a funcionar internamente
/* passport.serializeUser((usr, done) => {

})
 */



