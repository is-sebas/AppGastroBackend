const FacturaController = require('../controllers/facturaController');
const passport = require('passport');

module.exports = (app) => {
    app.post('/api/factura/create',  passport.authenticate('jwt', { session: false }), FacturaController.create);
    app.get('/api/factura/GetFacturaHTML/:id_mesa', passport.authenticate('jwt', { session: false }), FacturaController.GetFacturaHTML);
    app.post('/api/factura/reenvioFactura/:id_mesa/:id_user',  passport.authenticate('jwt', { session: false }), FacturaController.reenvioFactura);
}