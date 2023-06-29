const UsuariosActivos = require('../models/mesas');

module.exports = {
    
    findByUsuariosActivos(req, res) {
        const id_usuario = req.params.id_usuario;

        Mesas.findByUsuariosActivos(id_usuario, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los usuarios activos',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    create(req, res) {

        const usuariosActivos = JSON.parse(req.body.usuariosActivos); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        
        UsuariosActivos.create(usuariosActivos, (err, id_usuario) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario activo',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'El usuario activo se almaceno correctamente',
                data: data
            });
        });
    },

    update(req, res) {
        const usuariosActivos = req.body;

        UsuariosActivos.update(usuariosActivos, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización de los usuarios activos',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario activo se actualizo correctamente',
                data: data
            });
        })
    },

    delete(req, res) {
        const id = req.params.id;

        UsuariosActivos.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el usuario activo',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario activo se elimino correctamente',
                data: `${id}`
            });
        });
    },

}