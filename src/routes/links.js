const express = require('express')
const router = express.Router()
const dbPoolConn = require('../database') // Importando modulo database para poder hacer las consultas a la base de datos

// Rutas
router.get('/add', (req, res) => {
    res.render('links/add') // Renderizando el archivo add para mostrar en vista
})

router.post('/add', (req, res) => {
    res.send('Recived')
})

module.exports = router