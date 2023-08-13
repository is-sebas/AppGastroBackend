const reportesController = require('../controllers/reportesController');
const passport = require('passport');

module.exports = (app, upload) => {    
    app.get('/api/reportes/getReporteUsuario/:id_user/:fecha_desde/:fecha_hasta',  passport.authenticate('jwt', { session: false }), reportesController.getReporteUsuario);
    app.get('/api/reportes/getReporteComercioOnline/:id_local',  passport.authenticate('jwt', { session: false }), reportesController.getReporteComercioOnline);
    app.get('/api/reportes/getReporteComercioRangoFecha/:id_local/:fecha_desde/:fecha_hasta',  passport.authenticate('jwt', { session: false }), reportesController.getReporteComercioRangoFecha);
}


