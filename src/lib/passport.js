// Passport también nos permite realizar autenticaciones con medios sociales a través de twitter, google, facebook, entre otros.
// En nuestro caso la heremos de manera local con nuestra base de datos usando el módulo passport-local
const passport = require('passport') // Indicaremos que tipo de autenticación queremos
const LocalStrategy = require('passport-local').Strategy
const poolDB = require('../database')

const helpers = require('../lib/helpers')

// Método para signin
passport.use('local.signin', new LocalStrategy (
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true 
    }, async (req, username, password, done) => {

        const rows = await poolDB.query('SELECT * FROM users WHERE username = ?', [ username ])
        
        if( rows.length > 0 ) { // Si es mayor 0 es que ha encontrado a un usuario. 

            const user = rows[0] // Guardamos ese usuario
            const validatePassword = await helpers.matchPassword(password, user.password) // Validamos contraseña

            if ( validatePassword ) {

                done(null, user, req.flash('success', 'Welcome ' + user.username)) // Pasos null de error, user para serialize and deserialize, y mensaje flash de bienvenida
            
            } else {

                done(null, false, req.flash('message', 'incorrect password'))

            }
        } else {

            return done(null, false, req.flash('message', 'The username does not exists'))

        }

    }))

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


// La doc de passport nos indica que hay que definir dos partes de passport: Una para serializar al usuario y otra para deserializarlo
// Es un proceso de como passport va a funcionar internamente
// Con serializeUser() guardamos id de ese usuario
passport.serializeUser((user, done) => {
    return done(null, user.id)
})

// Con deserializeUser() obtenemos los datos almacenados con ese id
passport.deserializeUser( async (id, done) => {
    const row = await poolDB.query('SELECT * FROM users WHERE id = ?', id)
    return done(null, row[0])
})



