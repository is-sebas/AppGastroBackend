const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51N8s6BLtL5Hr4HtECNY6cvwUNG5vnVjUGCKptsgqlFlpzvERHoZ2BiQe4lupfUwlf75OOFXbMOK9hJ8SP9cbjooN00tt2jWySB');

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
            
                        for (const product of order.products) {
                            await OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                                if (err) {
                                    return res.status(501).json({
                                        success: false,
                                        message: 'Hubo un error con la creacion de los productos en la orden',
                                        error: err
                                    });
                                }
                            });
                        }
            
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