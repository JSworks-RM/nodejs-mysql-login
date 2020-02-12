const bcript = require('bcryptjs')

const helpers = {}

// Método para encriptar contraseña. Usaremos el módulo instalado bscriptjs
helpers.encriptPassword = async (password) => { // Recibimos contraseña plana
    const salt = await bcript.genSalt(10) // Generando un patrón para que funcione el cifrado
    const hash = await bcript.hash(password, salt)  // damos patrón y contraseña para que la cifre en base a la contraseña dada
    return hash // Una vez cifrada, la returnamos encriptada
}


// Método para el logging para comparar con la contraseña almacenada en base de datos. Este método compara dos strings. Compararemos la contraseña con la que intenta loguearse el usuario con la que tenemos almacenada en la base de datos
helpers.matchPassword = async (password, savePassword) => {
    try {
        return await bcript.compare(password, savePassword)
    } catch (e) {
        console.log('Error ==>', e)
    }
}

module.exports = helpers