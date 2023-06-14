const localesController = require('../controllers/localesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/locales/findById_local/:id_local',  passport.authenticate('jwt', { session: false }), localesController.findById_local);
    app.post('/api/locales/create', passport.authenticate('jwt', {session: false}) , localesController.create);
    app.put('/api/locales/update', passport.authenticate('jwt', {session: false}) , localesController.update);
    app.delete('/api/locales/delete/:id', passport.authenticate('jwt', {session: false}), localesController.delete);

}