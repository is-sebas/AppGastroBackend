const Factura = require('../models/factura');
const EnviarMail = require('../utils/sendEmail');
const User = require('../models/user');
const cheerio = require('cheerio');

module.exports = {

    async create(req, res) {

        const factura = req.body;
        
        Factura.create(factura, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de la factura',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'La factura se almaceno correctamente',
                data: data
            });
        });
    },

    async GetFacturaHTML(req, res) {
        const id_mesa = req.params.id_mesa;
    
        Factura.GetFacturaHTML(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener el detalle de la factura',
                    error: err
                });
            }
    
            // En lugar de analizarlo como JSON, simplemente devuélvelo como está
            const htmlData = data[0].detalle;
    
            return res.status(200).send(htmlData);
        });
    },

    async reenvioFactura(req, res) {
        const id_mesa = req.params.id_mesa;
        const id_user = req.params.id_user;
    
        async function DetalleHTML() {
            try {
                const resultado = await obtenerDetalleHTML(id_mesa);
        
                if (resultado && resultado.length > 0) {
                    const html = resultado[0].detalle;
                    console.log('Detalle HTML:', html);
        
                    return resultado;
                } else {
                    console.log('No se encontró el detalle de la factura.');
                    return null;
                }
            } catch (error) {
                console.error('Error al obtener el detalle de la factura:', error);
                throw error;
            }
        }
        
        async function obtenerDetalleHTML(id_mesa) {
            return new Promise((resolve, reject) => {
            Factura.GetFacturaHTML(id_mesa, (err, data) => {
                if (err) {
                reject(err);
                } else {
                resolve(data);
                }
            });
            });
        }
        
        const detalleHTML = await DetalleHTML();

        // Carga el HTML en Cheerio
        const $ = cheerio.load(detalleHTML);

        const todoElHTML = $.html();
        
        console.log('Detalle HTML: ', todoElHTML);

        // Obtenemos los datos de la factura:
        const datosFacturaUser = [];

        try {
            const datos = await obtenerDatosFacturaUser(id_user);
            datosFacturaUser.push(datos); // Agregar los datos del pago a la variable datosPago.

        } catch (error) {
            console.error('Hubo un error al obtener los datos de la factura del usuario: ', error);
        }

        async function obtenerDatosFacturaUser(id) {
            return new Promise((resolve, reject) => {
            User.datosFacturaUser(id, (err, datos) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(datos);
                });
            });
        }

        console.log('correo: ',datosFacturaUser[0][0].email);

        const destinatario = datosFacturaUser[0][0].email;

        EnviarMail(destinatario, todoElHTML);

        return res.status(200).json({
            success: true,
            message: 'Reenvio de factura realizado correctamente'
        });

    },

}