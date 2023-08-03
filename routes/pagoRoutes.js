const PagoController = require('../controllers/pagoController');
const passport = require('passport');

module.exports = (app) => {

    app.post('/api/pago/create',  passport.authenticate('jwt', { session: false }), PagoController.create);
    app.post('/api/pago/procesarPago',  passport.authenticate('jwt', { session: false }), PagoController.procesarPago);
    app.put('/api/pago/cierreMesa/:id_mesa',  passport.authenticate('jwt', { session: false }), PagoController.cierreMesa);

}