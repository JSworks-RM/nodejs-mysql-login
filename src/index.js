const express = require('express')
const morgan = require('morgan') // Morgan: Muestra por consola las peticiones que van llegando
const exphbs = require('express-handlebars') // Con éste módulo vamos a crear las plantillas para las vistas del front
const path = require('path') // Módulo nativo de node para facilitar configuración de rutas usando sus métodos. ej: path.join()

// Initializations
const app = express()


// Settings: Configuraciones que necesita mi servidor
app.set('port', process.env.PORT || 4000) // Si existe un port en el sistema cogelo, sino, coge el 4000
app.set('views', path.join(__dirname, 'views')) // Ubicación de la carpeta views
app.engine('.hbs', exphbs({ // Configuramos motor: Asignamos un nombre, usamos el módulo expressHbs y creamos un objeto para configurarlo -> exphbs({})
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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})) // Este método de express sirve para poder aceptar los datos que envien los usuarios desde un formulario 
app.use(express.json()) // Para extender con algúna app cliente para enviar y recibir JSON


// Global variables
app.use((req, res, next) => {
    // Funcionalidades ...
    next();
})


// Routes: Definiremos las urls que necesita mi servidor requiriéndolas desde la carpeta routes/fileName
app.use(require('./routes/index.js'))
app.use(require('./routes/authentication.js')) // Rutas relacionadas con login
app.use('/links', require('./routes/links.js')) // Rutas encargadas de poder almacenar un enlace, elimirarlo, actualizarlo... Primer parámetro un prefijo para que cuando pidamos una ruta link tengamos que pedirla con su prpefijo. /link/rutaSolicitada

// Public: Donde indicamos donde estarán las carpetas públicas
app.use(express.static(path.join(__dirname, 'public')))


// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})