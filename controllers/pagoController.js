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

        try {
            // 1. Actualizamos el estado de ordersCompart:
            for (const ordersCompart of datos) {
                await OrdersCompart.updateEstado(ordersCompart.id_order_compart, 2, (err, id_data) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error con la actualización del estado de la orden compartida',
                            error: err
                        });
                    }
                });
            }

            // 2. Obtenemos el id y datos de la tabla orders sin repetir OrdersId:
            const uniqueOrdersIds = {};
            const ordenesPromises = datos.map((ordersCompart) => {
                if (!uniqueOrdersIds[ordersCompart.id_order_compart]) {
                    uniqueOrdersIds[ordersCompart.id_order_compart] = true;
                    return new Promise((resolve) => {
                        OrdersCompart.getOrdenes(ordersCompart.id_order_compart, (err, orders) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error la obtener el listado de ordenes',
                                    error: err
                                });
                            }
                            resolve(orders);
                        });
                    });
                }
            });

            // Filtramos las promesas duplicadas y esperamos a que todas las promesas se resuelvan
            const ordenes = (await Promise.all(ordenesPromises)).filter(Boolean);
            console.log("Datos de las órdenes", ordenes);

            // 3. Actualizamos el estado de orders:
            for (const orderGroup of ordenes) {
                for (const order of orderGroup) {
                    Order.updateEstado(order.OrdersID, "PAGADO", (err, id_data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error con la actualización del estado de la orden',
                                error: err
                            });
                        }
                    });
                }
            }

            // 4. Actualizamos el monto a pagar en la tabla usuariosActivos:
            for (const orderGroup of ordenes) {
                for (const order of orderGroup) {
                    UsuariosActivos.updateMontoPagado(order.subTotal, order.id_usuarioActivo, order.id_mesa, (err, id_data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error con la actualización del monto pagado',
                                error: err
                            });
                        }
                    });
                }
            }

            async function obtenerDatosPago(metodoDePago, idUsuarioActivo, idMesa) {
                return new Promise((resolve, reject) => {
                    UsuariosActivos.getDatosPago(metodoDePago, idUsuarioActivo, idMesa, (err, data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error con la actualización del monto pagado',
                                error: err
                            });
                        } else {
                            resolve(data);
                        }
                    });
                });
            }
            
            // 5. Obtenemos los datos del pago y los capturamos en una variable:
            const datosPago = []; // Declarar la variable fuera del bucle para que esté disponible fuera de él.
            for (const ordersCompart of datos)
            {
                for (const orderGroup of ordenes) {
                    for (const order of orderGroup) {
                        try 
                        {
                            const datosPagoObtenidos = await obtenerDatosPago(ordersCompart.metododepago, order.id_usuarioActivo, order.id_mesa);
                            datosPago.push(datosPagoObtenidos); // Agregar los datos del pago a la variable datosPago.

                        } catch (error) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error al obtener los datos del pago',
                                error: error
                            });
                        }
                    }
                }
            }

            console.log("Datos del Pago: ", datosPago)

            // 6. Insertamos los logs del pago:

            // Llamar a la función para procesar los pagos
            procesarPagos(datosPago);

            async function procesarPagos(datosPago) {
                try {
                  // Recorrer todos los datos de pago
                  for (const pago of datosPago) {
                    // Llamar a Pago.create con cada objeto de pago
                    await new Promise((resolve, reject) => {
                      Pago.create(pago, (err, id_data) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(id_data);
                        }
                      });
                    });
                  }
              
                  console.log('Todos los pagos procesados correctamente');
              
                  // Aquí puedes devolver una respuesta exitosa si es necesario
                  res.status(200).json({ success: true, message: 'Pago procesado correctamente' });
              
                } catch (error) {
                  console.log('Hubo un error al procesar los pagos:', error);
              
                  // Aquí puedes devolver una respuesta de error si es necesario
                   res.status(501).json({ success: false, message: 'Hubo un error al procesar los pagos', error: error });
                }
              }
              
              
            return res.status(200).json({
                success: true,
                message: 'Pago procesado correctamente',
                data: datos
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al procesar el pago',
                error: error
            });
        }
    }
}