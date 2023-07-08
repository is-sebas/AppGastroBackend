const Mesas = require('../models/mesas');

module.exports = {
    
    findById_Existe_Mesa(req, res) {
        const id_mesa = req.params.id_mesa;

        Mesas.findById_Existe_Mesa(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las mesas',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    create(req, res) {

        //const mesa = JSON.parse(req.body.mesas); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        const mesa = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        
        Mesas.create(mesa, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de la mesa',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'La mesa se almaceno correctamente',
                data: data
            });
        });
    },

    update(req, res) {
        const mesa = req.body;

        Mesas.update(mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización de la mesa',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La mesa se actualizo correctamente',
                data: data
            });
        })
    },

    delete(req, res) {
        const id = req.params.id;

        Mesas.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar la mesa',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La mesa se elimino correctamente',
                data: `${id}`
            });
        });
    },

}