const Pago = require('../models/pago');
const OrdersCompart = require('../models/ordersCompart');
const UsuariosActivos = require('../models/usuariosActivos');
const Order = require('../models/order');
const Mesas = require('../models/mesas');
const _ = require('lodash');
const GeneradorFactura = require('../utils/generadorFactura');
const EnviarMail = require('../utils/sendEmail');

module.exports = {

    async create(req, res) {

        const pago = req.body;

        console.log("pago: ", pago);
                
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
              
                } catch (error) {
                  console.log('Hubo un error al procesar los pagos:', error);
                }
              }

            // 8. Procesar las ordenes
            const datosOrdenes = [];
            for (const pago of datosPagoFiltrados) {
                // Desestructurar el objeto de pago para acceder a sus propiedades individuales
                const {
                    id_mesa
                } = pago[0];

                try {
                    const datos = await obtenerDatosOrdenes(id_mesa);
                    datosOrdenes.push(datos); // Agregar los datos del pago a la variable datosPago.
    
                } catch (error) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error al obtener los datos de las ordenes',
                        error: error
                    });
                }
            }

            async function obtenerDatosOrdenes(idMesa) {
                return new Promise((resolve, reject) => {
                   // 1. Verificamos si la mesa cumple la condición para liberar la operación:
                    OrdersCompart.getCumpleCondicion(idMesa, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            }
            
            console.log('datosOrdenes: ', datosOrdenes);

            // Filtrar los datos que cumplan con la condición 'SI'
            const datosSiCumplen = datosOrdenes[0].filter(item => item.cumple_condicion === 'SI');

            console.log('datosSiCumplen: ',datosSiCumplen);

            // Procesar los datos que cumplen la condición
            for (const data of datosSiCumplen) {
                Order.updateEstado(data.OrdersID, 'PAGADO', (err, datos) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error al actualizar el estado de la orden',
                            error: err
                        });
                    }
                });
            }

            //Generación de HTML:
            const generador = new GeneradorFactura();
            const cliente = 'Ricardo Javier Gonzalez Braga';
            const ruc = '4163559-0';
            const direccion = 'Avda. España N° 1239 c/ Padre Cardozo';
            const telefono = '0995368295';
            const productos = [
              { nombre: 'Gaseosa - Coca Cola', cantidad: 2, precioUnitario: '10,000' },
              { nombre: 'Hamburguesas Completa', cantidad: 3, precioUnitario: '15,000' },
              { nombre: 'Cervezas Pilsen', cantidad: 1, precioUnitario: '20,000' },
            ];
            
            const rutaArchivo = 'factura.html';
            
            var facturaHTML = generador.generarFacturaHTML(cliente, ruc, direccion, telefono, productos, rutaArchivo);
            console.log('Factura generada', facturaHTML);

            //Enviar correo:
            const destinatario = 'sagz94@outlook.com';
            const htmlContent = facturaHTML;

            EnviarMail.enviarMail(destinatario, htmlContent);

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
    },

    async procesarPagoOnline(order_compart, res) {
        const datos = order_compart;
        console.log("datos: ", datos);

        try {
            // 1. Actualizamos el estado de ordersCompart:
            for (const ordersCompart of datos) {
                await OrdersCompart.updateEstado(ordersCompart.id_order_compart, 2, (err, id_data) => {
                    if (err) {
                        console.error('Hubo un error la obtener el listado de ordenes:', err);
                    }
                });
            }

            // 2. Obtenemos el id y datos de la tabla orders sin repetir OrdersId:
            const uniqueOrdersIds = {};
            const ordenesPromises = datos.map((ordersCompart) => {
                if (!uniqueOrdersIds[ordersCompart.id_order_compart]) {
                    uniqueOrdersIds[ordersCompart.id_order_compart] = true;
                    return new Promise((resolve, reject) => {
                        OrdersCompart.getOrdenes(ordersCompart.id_order_compart, (err, orders) => {
                            if (err) {
                                reject(err);
                            }
                            else 
                            {
                                resolve(orders);
                            }
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
                            reject(err);
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
                            console.error('Hubo un error al obtener los datos del pago: ', error);
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
                            reject(err);
                        }
                        else // Si todo está bien, resolvemos la promesa
                        {
                            resolve();
                        }
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
              
                } catch (error) {
                  console.log('Hubo un error al procesar los pagos:', error);
                }
              }

            // 8. Procesar las ordenes
            const datosOrdenes = [];
            for (const pago of datosPagoFiltrados) {
                // Desestructurar el objeto de pago para acceder a sus propiedades individuales
                const {
                    id_mesa
                } = pago[0];

                try {
                    const datos = await obtenerDatosOrdenes(id_mesa);
                    datosOrdenes.push(datos); // Agregar los datos del pago a la variable datosPago.

                } catch (error) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error al obtener los datos de las ordenes',
                        error: error
                    });
                }
            }

            async function obtenerDatosOrdenes(idMesa) {
                return new Promise((resolve, reject) => {
                // 1. Verificamos si la mesa cumple la condición para liberar la operación:
                    OrdersCompart.getCumpleCondicion(idMesa, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            }

            console.log('datosOrdenes: ', datosOrdenes);

            // Filtrar los datos que cumplan con la condición 'SI'
            const datosSiCumplen = datosOrdenes[0].filter(item => item.cumple_condicion === 'SI');

            console.log('datosSiCumplen: ',datosSiCumplen);

            // Procesar los datos que cumplen la condición
            for (const data of datosSiCumplen) {
                Order.updateEstado(data.OrdersID, 'PAGADO', (err, datos) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error al actualizar el estado de la orden',
                            error: err
                        });
                    }
                });
            }

            //Generación de HTML:
            const generador = new GeneradorFactura();
            const cliente = 'Ricardo Javier Gonzalez Braga';
            const ruc = '4163559-0';
            const direccion = 'Avda. España N° 1239 c/ Padre Cardozo';
            const telefono = '0995-368-295';
            const productos = [
                { nombre: 'Gaseosa - Coca Cola', cantidad: 2, precioUnitario: '10,000' },
                { nombre: 'Hamburguesas Completa', cantidad: 3, precioUnitario: '15,000' },
                { nombre: 'Cervezas Pilsen', cantidad: 1, precioUnitario: '20,000' },
            ];
            
            const rutaArchivo = 'factura.html';
            
            var facturaHTML = generador.generarFacturaHTML(cliente, ruc, direccion, telefono, productos, rutaArchivo);
            console.log('Factura generada', facturaHTML);

            //Enviar correo:
            const destinatario = 'sagz94@outlook.com';
            const htmlContent = facturaHTML;

        } catch (error) {
            console.log('Hubo un error al procesar los pagos:', error);
        }
    },

    async cierreMesa(req, res) {
        const id_mesa = req.params.id_mesa;

        // 1. Verificamos si la mesa cumple la condición para liberar la operación:
        const datos = await new Promise((resolve, reject) => {
            OrdersCompart.getCumpleCondicion(id_mesa, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        // Filtrar los datos que cumplan con la condición 'SI'
        const datosSiCumplen = datos.filter(item => item.cumple_condicion === 'SI');

        console.log('datosSiCumplen: ',datosSiCumplen);
        // Validar si todos los registros tienen cumple_condicion igual a 'SI'
        const todosCumplenCondicion = datosSiCumplen.length === datos.length;

        if (todosCumplenCondicion == true)
        {
            //Obtenemos los datos del pago de la mesa:
            const datosPagoMesa = await new Promise((resolve) => {
                Mesas.datosPago(id_mesa, (err, data) => {
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

            console.log('datosPagoMesa: ', datosPagoMesa);
            // Procesar los datos que cumplen la condición
            Mesas.updatePago(datosPagoMesa, (err) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error al actualizar el estado de la orden',
                        error: err
                    });
                }
            });

            // Procesar los datos de usuarios activos
            UsuariosActivos.updateCierreUser(id_mesa, (err) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error al actualizar los datos de usuarios Activos',
                        error: err
                    });
                }
            });

        }

        return res.status(200).json({
            success: true,
            message: 'Proceso realizado correctamente',
            todosCumplenCondicion: todosCumplenCondicion,
            data: datos
        });
    }
}