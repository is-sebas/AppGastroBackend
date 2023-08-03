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

    async mostrarMesaUserCuenta(req, res) {
        const id_mesa = req.params.id_mesa;
        const id_usuarioActivo = req.params.id_usuarioActivo;

        Mesas.mostrarMesaUserCuenta(id_mesa, id_usuarioActivo, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar el estado de la mesa',
                    error: err
                });
            }

       /*     for (const d of data) {
                console.log(d.users);
                d.users = JSON.parse(d.users);
            }
        */    
            
            return res.status(200).json(data);
        });
    },

    async GetMesaXQR(req, res) {
        const codigoQR = req.params.codigoQR;

        Mesas.GetMesaXQR(codigoQR, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las mesas por código QR',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async updatePago(req, res) {
        const mesa = req.body;

        Mesas.updatePago(mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización del pago en la mesa',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Los datos del pago en la mesa se actualizaron correctamente',
                data: data
            });
        })
    },

    async datosPago(req, res) {
        const id_mesa = req.params.id_mesa;

        Mesas.datosPago(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del pago de la mesa',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    }
}