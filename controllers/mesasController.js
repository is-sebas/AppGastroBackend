const Mesas = require('../models/mesas');

module.exports = {
    
    async findById_Existe_Mesa(req, res) {
        const id_mesa = req.params.id_mesa;

        Mesas.findById_Existe_Mesa(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las mesas',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async create(req, res) {

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

    async update(req, res) {
        const mesa = req.body;

        Mesas.update(mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización de la mesa',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'La mesa se actualizo correctamente',
                data: data
            });
        })
    },

    async ListMesas(req, res) {
        const id_local = req.params.id_local;

        Mesas.ListMesas(id_local, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las mesas por local',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

}