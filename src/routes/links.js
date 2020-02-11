const express = require('express')
const router = express.Router()
const dbPoolConn = require('../database') // Importando modulo database para poder hacer las consultas a la base de datos. Hace referencia a la base de datos.

// Rutas
router.get('/add', (req, res) => {
    res.render('links/add') // Renderizando el archivo add para mostrar en vista
})


// Insert in DATABASE
router.post('/add', async (req, res) => {
    // Método body recibe como objeto los datos enviados desde formulario. 
    // console.log(req.body)
    // Destructuramos los datos como buena práctica y luego los guardamos en un objeto
    const { title, url, description } = req.body
    //console.log(req.body)
    const newLink = {
            title,
            url,
            description
        };
    const sql = 'INSERT INTO links set ?'
        // console.log(newLink)
    // Guardamos en base de datos conectandonos a ella y ejecutando la siguiente sentencia sql
    // Insert en table link, establesiendo un dato nuevo con "set" ?, y a través del signo de interrogación indicamos que pasamos dato a continuación y le pasamos el dato dentro de un arreglo
    // La petición como va a tomar tiempo es asyncrona. Entonces podemos manejarla con un callback, promesa .then() y Sync Await
    await dbPoolConn.query( sql, newLink )
    res.redirect('/links')
})

// QUERY SELECT y redirección a la vista den links/list.hbs. ('/') = ('/links)
router.get('/', async (req, res) => {
    const links = await dbPoolConn.query('SELECT * FROM links')
    res.render('links/list.hbs', { links: links })
})

// QUERY DELETE 
// Para eliminar de la base de datos primero nos aseguramos que exista el ID que queremos eliminar => (req.params.id)
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params    
    await dbPoolConn.query('DELETE FROM links WHERE ID = ?', id )
    res.redirect('/links')
})

module.exports = router