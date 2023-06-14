const Locales = require('../models/locales');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {
    
    findById_Local(req, res) {
        const id_local = req.params.id_local;

        Locales.findById_local(id_local, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los locales',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    create(req, res) {

        const local = JSON.parse(req.body.local); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        
        Locales.create(local, (err, id_local) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del local',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'El local se almaceno correctamente',
                data: data
            });
        });
    },

    update(req, res) {
        const local = req.body;

        Locales.update(local, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del local',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El local se actualizo correctamente',
                data: data
            });
        })
    },

    delete(req, res) {
        const id = req.params.id;

        Locales.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el local',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El local se elimino correctamente',
                data: `${id}`
            });
        });
    },

}