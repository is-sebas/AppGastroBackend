const promocionesController = require('../controllers/promocionesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/promociones/getAll',  passport.authenticate('jwt', { session: false }), promocionesController.getAll);
}