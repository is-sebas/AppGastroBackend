const ordersCompartController = require('../controllers/ordersCompartController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.post('/api/ordersCompart/create', passport.authenticate('jwt', {session: false}) , ordersCompartController.create);
    app.get('/api/ordersCompart/ListOrdersCompart',  passport.authenticate('jwt', { session: false }), ordersCompartController.ListOrdersCompart);
    app.put('/api/ordersCompart/updateEstado/:id/:estado',  passport.authenticate('jwt', { session: false }), ordersCompartController.updateEstado);
    app.get('/api/ordersCompart/getOrdenes/:id',  passport.authenticate('jwt', { session: false }), ordersCompartController.getOrdenes);
}