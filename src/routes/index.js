// Mostraremos todas las rutas principales de nuestra aplicación
const express = require('express')
const router = express.Router() // Metodo Router al ejecutarse devuelve un objeto

// Definimos rutas. Para usarlas lo hacemos desde donde se carga la app (index.js)
router.get('/', (req, res) => {
    res.send('Hello World')
});

module.exports = router