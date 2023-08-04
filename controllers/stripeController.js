const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51N8s6BLtL5Hr4HtECNY6cvwUNG5vnVjUGCKptsgqlFlpzvERHoZ2BiQe4lupfUwlf75OOFXbMOK9hJ8SP9cbjooN00tt2jWySB');
const Pago = require('../models/pago');
const OrdersCompart = require('../models/ordersCompart');

module.exports = {
    async createPayment(req, res) {
        const data = req.body;
        const order = data.order;

        try {
            const payment = await stripe.paymentIntents.create({
                amount: data.amount,
                currency: 'USD',
                description: 'Compra en Ecommerce gastroapp',
                payment_method: data.id, //token
                confirm: true
            });
            console.log('PAYMENT: '+ JSON.stringify(payment, null, 3 ));

            if (payment !== null && payment !== undefined) {
                if (payment.status === 'succeeded') {
                    Order.create(order, async (err, id) => {

                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error al momento de crear la orden',
                                error: err
                            });
                        }
                    
                        console.log("Id generado: ", id);

                        //Obtenemos los datos para procesar el pago de ordersCompart:
                        const datosPagoOrderCompart = await new Promise((resolve) => {
                            OrdersCompart.getDatosPago(id, (err, data) => {
                                if (err) {
                                    return res.status(501).json({
                                        success: false,
                                        message: 'Hubo un error al obtener los datos del pago de la mesa',
                                        error: err
                                    });
                                }
                                resolve(data);
                            });
                        });
                    
                        //Realizamos el llamado al endpoind para procesar el pago:
                        Pago.procesarPago(datosPagoOrderCompart, (err) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error al procesar el pago',
                                    error: err
                                });
                            }
                        });
            
                        return res.status(201).json({
                            success: true,
                            message: 'Transaccion exitosa, la orden se ha creado correctamente',
                            data: `${id}` // EL ID DE LA NUEVA ORDEN
                        });
            
                    });
                }
                else {
                    return res.status(501).json({
                        success: false,
                        message: 'No se pudo efectuar la transaccion',
                    });
                }
            }
            else {
                return res.status(200).json({
                    success: false,
                    message: 'No se pudo efectuar la transaccion',
                });
            }

        } catch (error) {
            return res.status(200).json({
                success: false,
                message: 'No se pudo efectuar la transaccion',
            });
        }
    }
}