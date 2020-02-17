const express = require('express')
const router = express.Router()
const dbPoolConn = require('../database') // Importando modulo database para poder hacer las consultas a la base de datos. Hace referencia a la base de datos.
const { isLoggedIn } = require('../lib/auth')

// Rutas
router.get('/add', isLoggedIn, (req, res) => {
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
    // Llamamos a flash para enviar mensaje de respuesta al cliente
    // Para que funcione flash hay que almacenarlo en una sesión. Utilizaremos el módulo express-session
    // Al utilizar flash desde middleware, lo tenemos desde un request; Entonces decir req.flash()significa decir que utilice éste módulo flash
    // Flash recibe dos parámetros. El nombre con el que queremos guardar el mensaje y el segundo es el valor de ese mensaje
    // Hacemos disponible en todas las vistas declarandolo en las variables globales para poder validar si existe el mensaje y poder mostrarlo
    req.flash('success', 'Link saved successfully') 
    res.redirect('/links')
})

// QUERY SELECT y redirección a la vista de links/list.hbs. ('/') = ('/links)
router.get('/', isLoggedIn, async (req, res) => {
    const links = await dbPoolConn.query('SELECT * FROM links')
    res.render('links/list.hbs', { links: links })
})

// QUERY DELETE 
// Para eliminar de la base de datos primero nos aseguramos que exista el ID que queremos eliminar => (req.params.id)
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params    
    await dbPoolConn.query('DELETE FROM links WHERE ID = ?', id )
    req.flash('success', 'Link DELETED successfully')
    res.redirect('/links')
})

// QUERY UPDATE
// Para editar de la base de datos primero nos aseguramos que exista el ID que queremos eliminar => (req.params.id) y que se estan recibiendo correctamente los datos que queremos guardar
// Para eso, vamos a mostrar una nueva vista con el formulario a editar. Creamos un nuevo link edit.hbs, pintamos un formulario. (Similar al del ADD)
// Consultamos a base de datos y seleccionamos datos del id a editar para poblar el formulario a editar. Poblamos con atributo value para mostrar en pantalla el dato actual de ese id
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const links = await dbPoolConn.query('SELECT * FROM links where ID = ?', id)
    res.render('links/edit', { link: links[0] }) // Pasamos prop links: los links que obtenemos de la base de datos 
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description
    }
    await dbPoolConn.query('UPDATE links set ? WHERE ID = ?', [ newLink, id ])
    req.flash('success', 'Link UPDATED successfully')
    res.redirect('/links')
})

module.exports = router