const localesController = require('../controllers/localesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/locales/getAll',  passport.authenticate('jwt', { session: false }), localesController.getAll);
    app.get('/api/locales/findById_Local/:id_local',  passport.authenticate('jwt', { session: false }), localesController.findById_Local);
    app.post('/api/locales/create', passport.authenticate('jwt', {session: false}), upload.array('image', 1) , localesController.create);
    app.put('/api/locales/update', passport.authenticate('jwt', {session: false}) , localesController.update);
    app.put('/api/locales/updateWithImage', passport.authenticate('jwt', {session: false}) , upload.array('image', 1), localesController.updateWithImage);
    app.delete('/api/locales/delete/:id_local', passport.authenticate('jwt', {session: false}), localesController.delete);
    app.get('/api/locales/GetlocalXMesa/:id_mesa',  passport.authenticate('jwt', { session: false }), localesController.GetlocalXMesa);
}