const FacturaController = require('../controllers/facturaController');
const passport = require('passport');

module.exports = (app) => {
    app.post('/api/factura/create',  passport.authenticate('jwt', { session: false }), FacturaController.create);
    app.get('/api/factura/GetFacturaHTML/:nro_factura', passport.authenticate('jwt', { session: false }), FacturaController.GetFacturaHTML);
}