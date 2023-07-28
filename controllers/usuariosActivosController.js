const UsuariosActivos = require('../models/usuariosActivos');

module.exports = {
    
    async ListUsersActivos(req, res) {

        UsuariosActivos.ListUsersActivos((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los usuarios activos',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async ListUsersInactivos(req, res) {

        UsuariosActivos.ListUsersInactivos((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los usuarios inactivos',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async ListUserMesas(req, res) {
        const id_mesa = req.params.id_mesa;
        const status = req.params.status;

        UsuariosActivos.ListUserMesas(id_mesa, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }
            
            return res.status(200).json(data);
        });
    },

    async create(req, res) {

        const usuariosActivos = req.body;
        
        UsuariosActivos.create(usuariosActivos, (err, data) => {
    
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

    async update(req, res) {
        const usuariosActivos = req.body;

        UsuariosActivos.update(usuariosActivos, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización de los usuarios activos',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'El usuario activo se actualizo correctamente',
                data: data
            });
        })
    },

    async delete(req, res) {
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

    async listDatosUserMesaLocal(req, res) {
        const id_user = req.params.id_user;

        UsuariosActivos.listDatosUserMesaLocal(id_user, (err, data) => {
          if (err) {
            return res.status(501).json({
              success: false,
              message: "Hubo un error con al listar los datos del usuario",
              error: err,
            });
          }
    
          return res.status(200).json(data);
        });
      },

      async createTemp(req, res) {

        const usuariosActivos = req.body;
        
        UsuariosActivos.createTemp(usuariosActivos, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario temporal',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'El usuario temporal se almaceno correctamente',
                data: data
            });
        });
    },

    async updateMontoPagado(req, res) {

        const monto_pagado = req.params.monto_pagado;
        const id_usuario = req.params.id_usuario;
        const id_mesa = req.params.id_mesa;

        UsuariosActivos.updateMontoPagado(monto_pagado, id_usuario, id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización del monto pagado',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'El monto pagado se se actualizo correctamente',
                data: data
            });
        })
    },

    async getDatosPago(req, res) {
        const metodoDePago = req.params.metodoDePago;
        const id_usuario = req.params.id_usuario;
        const id_mesa = req.params.id_mesa;

        UsuariosActivos.getDatosPago(metodoDePago, id_usuario, id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del pago',
                    error: err
                });
            }
            
            return res.status(200).json(data);
        });
    },
}