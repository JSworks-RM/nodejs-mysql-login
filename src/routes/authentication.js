const express = require('express')
const router = express.Router()

const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth') // Importamos el método de validación del log

// Ruta para renderizar el formulario (get method)
router.get('/signup', isNotLoggedIn, (req, res) => {
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
        failureRedirect: '/signup', // Cuando algo va mal con el usuario al registrarse lo direccionamos a la page de registro
        failureFlash: true // Menjsaje en caso de un fallo

    }) // Colocamos el nombre que le asignamos en el archivo separado de configuración (passport.js)
    res.send('Recived')
}) */

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

// Ruta para renderizar datos del signin
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin')
})

// Ruta para autenticar los datos que vienen desde formulario de login
router.post( '/signin', isNotLoggedIn, (req, res, next) => {
        passport.authenticate ( 
            'local.signin', 
            {
                successRedirect: '/profile',
                failureRedirect: '/signin',
                failureFlash: true
            }
        )(req, res, next)
    }) 


router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut()
    res.redirect('/signin')
})

module.exports = router