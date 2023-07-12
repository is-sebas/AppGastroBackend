const OrdersCompart = require('../models/ordersCompart');

module.exports = {
    
    async create(req, res) {

        const ordersCompart = req.body;
        
        OrdersCompart.create(ordersCompart, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de orders Compart',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'Orders Compart se almaceno correctamente',
                data: data
            });
        });
    },

    async ListOrdersCompart(req, res) {

        OrdersCompart.ListOrdersCompart((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar orders compart',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

}