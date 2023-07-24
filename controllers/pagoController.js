const Pago = require('../models/pago');
const OrdersCompart = require('../models/ordersCompart');
const Order = require('../models/order');
const UsuariosActivos = require('../models/usuariosActivos');
const Mesas = require('../models/mesas');

module.exports = {

    async create(req, res) {

        const pago = req.body;

        Pago.create(pago, async (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de registrar el Pago',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El pago se ha registrado correctamente',
                data: data 
            });

        });
    },

    async procesarPago(req, res) {

        const datos = req.body;

        console.log("datos: ", datos);
        // 1. Actualizamos el estado de ordersCompart 
        for (const ordersCompart of datos.OrdersCompart) {
            await OrdersCompart.updateEstado(ordersCompart.id_order_compart, 'PAGADO', (err, id_data) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualización del estado de la orden compartida',
                        error: err
                    });
                }
            });
        }        

        /*
        Pago.create(pago, async (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de registrar el Pago',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El pago se ha registrado correctamente',
                data: data 
            });

        });*/

    }
}