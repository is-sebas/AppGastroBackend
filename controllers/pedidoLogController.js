const PedidoLog = require('../models/pedidoLog');

module.exports = {

    async create(req, res) {

        const pedidoLog = req.body;
        
        PedidoLog.create(pedidoLog, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del Log del Pedido',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'El log se almaceno correctamente',
                data: data
            });
        });
    },

    async listLogsMesas(req, res) {
        const id_mesa = req.params.id_mesa;

        PedidoLog.listLogsMesas(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los logs de la mesa',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async listLogsOrders(req, res) {
        const id_orders = req.params.id_orders;

        PedidoLog.listLogsOrders(id_orders, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar el logs de Orders',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async update(req, res) {
        const pedidoLog = req.body;

        PedidoLog.update(pedidoLog, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización del log',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'El log se actualizo correctamente',
                data: data
            });
        })
    },

}