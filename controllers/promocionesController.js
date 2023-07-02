const Promociones = require('../models/promociones');

module.exports = {
    
    list_promociones(req, res) {

        Promociones.list_promociones( (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las promociones',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

}