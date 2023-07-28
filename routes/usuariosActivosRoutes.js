const usuariosActivosController = require('../controllers/usuariosActivosController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/usuariosActivos/ListUserMesas/:id_mesa/:status',  passport.authenticate('jwt', { session: false }), usuariosActivosController.ListUserMesas);
    app.get('/api/usuariosActivos/listDatosUserMesaLocal/:id_user', passport.authenticate('jwt', { session: false }), usuariosActivosController.listDatosUserMesaLocal);
    app.get('/api/usuariosActivos/ListUsersActivos', passport.authenticate('jwt', { session: false }), usuariosActivosController.ListUsersActivos);
    app.get('/api/usuariosActivos/ListUsersInactivos', passport.authenticate('jwt', { session: false }), usuariosActivosController.ListUsersInactivos);
    app.post('/api/usuariosActivos/create', passport.authenticate('jwt', {session: false}) , usuariosActivosController.create);
    app.post('/api/usuariosActivos/createTemp', passport.authenticate('jwt', {session: false}) , usuariosActivosController.createTemp);
    app.put('/api/usuariosActivos/update', passport.authenticate('jwt', {session: false}) , usuariosActivosController.update);
    app.delete('/api/usuariosActivos/delete/:id', passport.authenticate('jwt', {session: false}), usuariosActivosController.delete);
    app.put('/api/usuariosActivos/updateMontoPagado/:monto_pagado/:id_usuario/:id_mesa',  passport.authenticate('jwt', { session: false }), usuariosActivosController.updateMontoPagado);
    app.get('/api/usuariosActivos/getDatosPago/:metodoDePago/:id_usuario/:id_mesa', passport.authenticate('jwt', { session: false }), usuariosActivosController.getDatosPago);
}