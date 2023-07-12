const pedidoLogController = require('../controllers/pedidoLogController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.post('/api/pedidoLog/create', passport.authenticate('jwt', {session: false}) , pedidoLogController.create);
    app.get('/api/pedidoLog/listLogsMesas/:id_mesa',  passport.authenticate('jwt', { session: false }), pedidoLogController.listLogsMesas);
    app.get('/api/pedidoLog/listLogsOrders/:id_orders',  passport.authenticate('jwt', { session: false }), pedidoLogController.listLogsOrders);
    app.put('/api/pedidoLog/update', passport.authenticate('jwt', {session: false}) , pedidoLogController.update);
    
}