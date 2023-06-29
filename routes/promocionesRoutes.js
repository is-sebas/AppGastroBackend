const promocionesController = require('../controllers/promocionesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/promociones/list_promociones/',  passport.authenticate('jwt', { session: false }), promocionesController.list_promociones);
}