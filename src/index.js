const express = require('express')
const morgan = require('morgan') // Morgan: Muestra por consola las peticiones que van llegando
const exphbs = require('express-handlebars') // Con éste módulo vamos a crear las plantillas para las vistas del front
const path = require('path') // Módulo nativo de node para facilitar configuración de rutas usando sus métodos. ej: path.join()
const flash = require('connect-flash') // Middleware que permite enviar mensajes desde diferentes vistas
const session = require('express-session') // Las sessions son para almacenar datos en el servidor
const MySQLStore = require('express-session-mysql')
const passport = require('passport') // Lo requerimos para poder ejecutar su código principal

const { database } = require('./keys')

// Initializations
const app = express()
require('./lib/passport') // Requerimos la ruta de autenticación para que la app se entere de la autenticación que estamos creando


// Settings: Configuraciones que necesita mi servidor
app.set('port', process.env.PORT || 4000) // Si existe un port en el sistema cogelo, sino, coge el 4000
app.set('views', path.join(__dirname, 'views')) // Ubicación de la carpeta views
// Configuramos motor -> "app.engine": Asignamos un nombre, usamos el método exphbs({}) del módulo express-handlebars y creamos un objeto para la plantilla de las vistas -> exphbs({})
app.engine('.hbs', exphbs({ 
    defaultLayout: 'main', // Nombre plantilla principal (layouts/main) donde colocaremos las partes comúnes de mi navegación.
    layoutDir: path.join( app.get('views'), 'layouts'), // Configuración de ruta de directorio layouts para indicar localicación de ruta de esa carpeta
    partialsDir: path.join( app.get('views'), 'partials'), // Concatenamos ruta views con partials => raiz/views/partials
    extname: '.hbs', // Configurando la extensión de los archivos de plantilla
    // En handlebars usaremos algunas funciones que las definiremos en una carpeta lib en un archivo que llamaremos handlebars.js
    // Lo necesitamos porque es la manera en que funciona handlebars. Las funciones se ejecutan por aparte a traves de algo llamado "helpers"
    helpers: require('./lib/handlebars') // Configuración de helpers
}))
// Ya que hemos configurado el motor "engine" para usarlo hay que configurarlo con app.set('view engine', 'nombreDelMotor')
app.set('view engine', '.hbs') // Usamos el motor


// Middlewares: Son funciones que se ejecutan cada vez que un usuario envía una petición o cada vez que una aplicación cliente envía una petición al servidor
app.use(session({ // Configurando la session en un objeto
    secret: 'mysqlsession',
    resave: false, // Para que no empiece a renovar
    saveUninitialized: false, // Para que no se vuelva a iniciar la sesión
    store: new MySQLStore(database) // Indicamos donde se va a guardar la session. Para ello hay que instalar y requerir el módulo express-mysql.session, lo instanciamos y le pasamos la conexion de la base de datos
}))
app.use(flash())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})) // Este método de express sirve para poder aceptar los datos que envien los usuarios desde un formulario 
app.use(express.json()) // Para extender con algúna app cliente para enviar y recibir JSON
// Inicializamos passport pero para que sepa donde va a guardar los datos, passport usa una session
app.use(passport.initialize()) // Inicializamos passport
app.use(passport.session()) // Abrimos session para poder indicar a passport dónde guardar datos


// Global variables
app.use((req, res, next) => {
    // Funcionalidades ...
    app.locals.success = req.flash('success') // Hacemos disponible la variable global de mensaje exitoso
    app.locals.message = req.flash('message') // Hacemos disponible la variable global de mensaje error
    app.locals.user = req.user // Dato de sesión del usuario que almacenamos en variable global para poder usarla desde cualquier vista
    next();
})


// Routes: Definiremos las urls que necesita mi servidor requiriéndolas desde la carpeta routes/fileName
app.use(require('./routes/index.js'))
app.use(require('./routes/authentication.js')) // Rutas relacionadas con login
app.use('/links', require('./routes/links.js')) // Rutas encargadas de poder almacenar un enlace, elimirarlo, actualizarlo... Primer parámetro un prefijo para que cuando pidamos una ruta link tengamos que pedirla con su preefijo. /link/rutaSolicitada

// Public: Donde indicamos donde estarán las carpetas públicas
app.use(express.static(path.join(__dirname, 'public')))


// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})