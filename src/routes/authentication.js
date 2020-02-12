const express = require('express')
const router = express.Router()

const passport = require('passport')

// Ruta para renderizar el formulario (get method)
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

// Ruta para recibir los datos de ese formulario (post method)
// La autenticación la procesaremos en una ruta por aparte. 
// Trabajaremos con los módulos passport, passport-local que trabajan junto con express-session para hacerla lo mas profesional posible y mas sencillo de utilizar
// Definiremos los métodos de autenticación desde lib/
/* router.post('/signup', (req, res) => {
    console.log(req.body)
    passport.authenticate('local.signup', {

        successRedirect: '/profile', // Enviamos a página de exito
        fairlureRedirect: '/signup', // Cuando algo va mal con el usuario al registrarse
        fairlureFlash: true // Menjsaje en caso de un fallo

    }) // Colocamos el nombre que le asignamos en el archivo separado de configuración (passport.js)
    res.send('Recived')
}) */

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

// Ruta para renderizar datos del signin
router.get('/signin', (req, res) => {
    res.render('auth/signin')
})

// Ruta para autenticar los datos que vienen desde formulario de login
router.post( '/signin', (req, res, next) => {
        passport.authenticate ( 
            'local.signin', 
            {
                successRedirect: '/profile',
                failureRedirect: '/signin',
                failureFlash: true
            }
        )(req, res, next)
    }) 


router.get('/profile', (req, res) => {
    res.send('This is a profile')
})

module.exports = router