const db = require('../config/config');

const Factura = {};

Factura.create = (factura, result) => {

    const sql = `
    INSERT INTO 
        facturas(
            id_local, 
            id_cliente, 
            monto, 
            ruc,
            denominacion,
            gestor,
            nro_factura,
            detalle, 
            fecha)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(
            sql, 
            [
                factura.id_local,
                factura.id_cliente,
                factura.monto,
                factura.ruc,
                factura.denominacion,
                factura.gestor,
                factura.nro_factura,
                factura.detalle,
                new Date()
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                } else {
                    console.log('Id de la nueva factura generada: ', res.insertId);
                    result(null, res.insertId);
                }
            }
        );
}

module.exports = Factura;