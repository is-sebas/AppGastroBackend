const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51N8s6BLtL5Hr4HtECNY6cvwUNG5vnVjUGCKptsgqlFlpzvERHoZ2BiQe4lupfUwlf75OOFXbMOK9hJ8SP9cbjooN00tt2jWySB');
const Pago = require('../models/pago');
const OrdersCompart = require('../models/ordersCompart');

module.exports = {
    async createPayment(req, res) {
        const data = req.body;
        const order_compart = data.order_compart;

        try {
            console.log('data.amount: ',data.amount);
            console.log('data.id: ',data.id);

            const payment = await stripe.paymentIntents.create({
                amount: data.amount,
                currency: 'PYG',
                description: 'Compra en Ecommerce gastroapp',
                payment_method: data.id, //token
                confirm: true
            });
            console.log('PAYMENT: '+ JSON.stringify(payment, null, 3 ));

            if (payment !== null && payment !== undefined) {
                if (payment.status === 'succeeded') {

                    //Realizamos el llamado al endpoind para procesar el pago:
                    Pago.procesarPago(order_compart, (err) => {
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