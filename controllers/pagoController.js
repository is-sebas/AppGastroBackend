const Pago = require('../models/pago');
const OrdersCompart = require('../models/ordersCompart');
const UsuariosActivos = require('../models/usuariosActivos');
const _ = require('lodash');

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
            for (const ordersCompart of datos) {
                for (const orderGroup of ordenes) {
                    for (const order of orderGroup) {
                        try {
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
            
            // Crear un objeto para rastrear los objetos únicos por su propiedad "id_cliente"
            const clientesUnicos = {};

            // Filtrar y mantener solamente los objetos únicos en datosPago
            const datosPagoFiltrados = datosPago.filter((obj) => {
            if (!clientesUnicos.hasOwnProperty(obj[0].id_cliente)) {
                clientesUnicos[obj[0].id_cliente] = true;
                return true;
            }
            return false;
            });

            console.log("Datos del Pago filtrados: ", datosPagoFiltrados);

            // 6. Actualizamos el monto a pagar en la tabla usuariosActivos:
            for (const pago of datosPagoFiltrados) {
                // Desestructurar el objeto de pago para acceder a sus propiedades individuales
                const {
                    id_cliente,
                    id_mesa,
                    montoPagado
                } = pago[0];

                // Llamar a UsuariosAcitos.updateMontoPagado con cada objeto de pago
                await new Promise((resolve, reject) => {
                    console.log("montoPagado: ", montoPagado);
                    UsuariosActivos.updateMontoPagado(montoPagado, id_cliente, id_mesa, (err, id_data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error con la actualización del monto pagado',
                                error: err
                            });
                        }
                        // Si todo está bien, resolvemos la promesa
                        resolve();
                    });
                });
            }

            // 7. Insertamos los logs del pago:

            // Llamar a la función para procesar los pagos
            procesarPagos(datosPagoFiltrados);

            async function procesarPagos(datosPago) {
                try {
                  // Recorrer todos los datos de pago
                  for (const pago of datosPago) {
                    console.log("pago ", pago)
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
                  //res.status(200).json({ success: true, message: 'Pago procesado correctamente' });
              
                } catch (error) {
                  console.log('Hubo un error al procesar los pagos:', error);
              
                  // Aquí puedes devolver una respuesta de error si es necesario
                   //res.status(501).json({ success: false, message: 'Hubo un error al procesar los pagos', error: error });
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