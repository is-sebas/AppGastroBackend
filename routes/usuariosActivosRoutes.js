const usuariosActivosController = require('../controllers/usuariosActivosController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/usuariosActivos/ListUsersActivos', passport.authenticate('jwt', { session: false }), usuariosActivosController.ListUsersActivos);
    app.get('/api/usuariosActivos/ListUsersInactivos', passport.authenticate('jwt', { session: false }), usuariosActivosController.ListUsersInactivos);
    app.post('/api/usuariosActivos/create', passport.authenticate('jwt', {session: false}) , usuariosActivosController.create);
    app.put('/api/usuariosActivos/update', passport.authenticate('jwt', {session: false}) , usuariosActivosController.update);
    app.delete('/api/usuariosActivos/delete/:id', passport.authenticate('jwt', {session: false}), usuariosActivosController.delete);

}