const usersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen);
    app.get('/api/users/GetRolUser/:id', passport.authenticate('jwt', { session: false }), usersController.GetRolUser);
    app.get('/api/users/datosFacturaUser/:id', passport.authenticate('jwt', { session: false }), usersController.datosFacturaUser);
    app.get('/api/users/datosInsertFactura/:id_user/:id_mesa/:monto/:nro_factura/:detalle', passport.authenticate('jwt', { session: false }), usersController.datosInsertFactura);

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createUserTemp', usersController.createUserTemp);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);
    
    // 401 UNAUTHORIZED
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}) , upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), usersController.updateWithoutImage);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', {session: false}), usersController.updateNotificationToken);


}