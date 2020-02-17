module.exports = {
    // Método de passport para comprobar si un user esta logueado o no
    isLoggedIn ( req, res, next ) {
        if ( req.isAuthenticated() ) {
            return next()
        } else {
            return res.redirect('/signin')
        }
    },

    isNotLoggedIn ( req, res, next ) {
        if ( !req.isAuthenticated() ) {
            return next()
        } else {
            return res.redirect('/profile')
        }
    }
}