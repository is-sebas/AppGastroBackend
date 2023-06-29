const usuariosActivosController = require('../controllers/usuariosActivosController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/usuariosActivos/findByUsuariosActivos/:id_usuario',  passport.authenticate('jwt', { session: false }), usuariosActivosController.findByUsuariosActivos);
    app.post('/api/usuariosActivos/create', passport.authenticate('jwt', {session: false}) , usuariosActivosController.create);
    app.put('/api/usuariosActivos/update', passport.authenticate('jwt', {session: false}) , usuariosActivosController.update);
    app.delete('/api/usuariosActivos/delete/:id', passport.authenticate('jwt', {session: false}), usuariosActivosController.delete);

}