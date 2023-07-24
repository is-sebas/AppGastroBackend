const PagoController = require('../controllers/pagoController');
const passport = require('passport');

module.exports = (app) => {

    app.post('/api/pago/create',  passport.authenticate('jwt', { session: false }), PagoController.create);

}