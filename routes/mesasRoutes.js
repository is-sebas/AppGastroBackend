const mesasController = require('../controllers/mesasController');
const passport = require('passport');

module.exports = (app, upload) => {
    
    app.get('/api/mesas/mostrarMesaUserCuenta/:id_mesa/:id_usuarioActivo',  passport.authenticate('jwt', { session: false }), mesasController.mostrarMesaUserCuenta);
    app.get('/api/mesas/findById_Existe_Mesa/:id_mesa',  passport.authenticate('jwt', { session: false }), mesasController.findById_Existe_Mesa);
    app.post('/api/mesas/create', passport.authenticate('jwt', {session: false}) , mesasController.create);
    app.put('/api/mesas/update', passport.authenticate('jwt', {session: false}) , mesasController.update);
    app.get('/api/mesas/ListMesas/:id_local',  passport.authenticate('jwt', { session: false }), mesasController.ListMesas);
    app.get('/api/mesas/GetMesaXQR/:codigoQR',  passport.authenticate('jwt', { session: false }), mesasController.GetMesaXQR);
    app.put('/api/mesas/updatePago', passport.authenticate('jwt', {session: false}) , mesasController.updatePago);
    app.get('/api/mesas/datosPago/:id_mesa',  passport.authenticate('jwt', { session: false }), mesasController.datosPago);}