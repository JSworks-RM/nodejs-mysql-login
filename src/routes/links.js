const express = require('express')
const router = express.Router()
const dbPoolConn = require('../database') // Importando modulo database para poder hacer las consultas a la base de datos

module.exports = router