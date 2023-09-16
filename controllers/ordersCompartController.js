const OrdersCompart = require('../models/ordersCompart');

module.exports = {
    
    async create(req, res) {

        const ordersCompart = req.body;
        
        OrdersCompart.create(ordersCompart, (err, data) => {
    
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de orders Compart',
                    error: err
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'Orders Compart se almaceno correctamente',
                data: data
            });
        });
    },

    async ListOrdersCompart(req, res) {

        OrdersCompart.ListOrdersCompart((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar orders compart',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async updateEstado(req, res) {

        const id = req.params.id;
        const estado = req.params.estado;

        OrdersCompart.updateEstado(id,estado, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar el estado de la orden compartida',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El estado se ha actualizado correctamente',
                data: data
            });

        });
    },

    async getOrdenes(req, res) {
        const id = req.params.id;

        OrdersCompart.getOrdenes(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async getCumpleCondicion(req, res) {
        const id_mesa = req.params.id_mesa;

        OrdersCompart.getCumpleCondicion(id_mesa, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async getDatosPago(req, res) {
        const OrderID = req.params.OrderID;

        OrdersCompart.getDatosPago(OrderID, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del pago',
                    error: err
                });
            }

            return res.status(200).json(data);
        });
    },

    async delete(req, res) {

        const id = req.params.id;

        OrdersCompart.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar las ordenes compartidas',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Las ordenes se han eliminado correctamente',
                data: data
            });

        });
    },

    async replace(req, res) {

        const datos = req.body;
        const ordersID = datos.ordersCompart[0].OrdersID;

        console.log('xxx. datos: ', datos);
        console.log('xxx. ordersID: ', ordersID);

        OrdersCompart.delete(ordersID, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al eliminar las ordenes compartidas',
                    error: err
                });
            }
        });

        
        for (const ordersCompart of datos.ordersCompart) {
            console.log('xxx. ordersCompart: ', ordersCompart);
        
            OrdersCompart.create(ordersCompart, (err, data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message: 'Hubo un error con el registro de orders Compart',
                  error: err
                });
              }
            });
          }
        
          // Respuesta después de que se complete el bucle
          return res.status(201).json({
            success: true,
            message: 'Orders Compart reemplazada correctamente',
            data: datos.ordersCompart  // Puedes incluir los datos si lo deseas.
          });

    }
}