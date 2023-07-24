const db = require('../config/config');

const Pago = {};

Pago.create = (pago, result) => {

    const sql = `
    INSERT INTO 
        pagosLogs(
            id_cliente,
            id_mesero,
            metodoDePago,
            montoPagado,
            fechaPago
        )
    VALUES(?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            pago.id_cliente,
            pago.id_mesero,
            pago.metodoDePago,
            pago.montoPagado,
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo pago: ', res.insertId);
                result(null, res.insertId);
            }
        }

    )

}

module.exports = Pago;