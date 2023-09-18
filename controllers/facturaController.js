const Factura = require('../models/factura');

module.exports = {

    async create(req, res) {

        const factura = req.body;
        
        Factura.create(factura, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de la factura',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'La factura se almaceno correctamente',
                data: data
            });
        });
    },

    async GetFacturaHTML(req, res) {
        const nro_factura = req.params.nro_factura;

        Factura.GetFacturaHTML(nro_factura, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener el detalle de la factura',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

}