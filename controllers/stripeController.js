const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51N8s6BLtL5Hr4HtECNY6cvwUNG5vnVjUGCKptsgqlFlpzvERHoZ2BiQe4lupfUwlf75OOFXbMOK9hJ8SP9cbjooN00tt2jWySB');
const Pago = require('../controllers/pagoController');

module.exports = {
    async createPayment(req, res) {
        const data = req.body;
        const order_compart = data.order_compart;

        try {
            const payment = await stripe.paymentIntents.create({
                amount: data.amount,
                currency: 'PYG',
                description: 'Compra en Ecommerce gastroapp',
                payment_method: data.id, //token
                confirm: true
            });
            console.log('PAYMENT: '+ JSON.stringify(payment, null, 3 ));
            console.log('payment.status: ', payment.status);

            if (payment !== null) {
                if (payment.status === 'succeeded') {

                    // Realizamos el llamado al endpoint para procesar el pago:
                    await Pago.procesarPagoOnline(order_compart, res);

                    return res.status(201).json({
                        success: true,
                        message: 'Transaccion exitosa, el pago se realizado correctamente'
                    });

                }
                else {
                    return res.status(501).json({
                        error: 'Error' + res.err,
                        success: false,
                        message: 'No se pudo efectuar la transaccion',
                    });
                }
            }
            else {
                return res.status(501).json({
                    success: false,
                    message: 'No se pudo efectuar la transaccion',
                });
            }

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'No se pudo efectuar la transaccion',
            });
        }
    }
}