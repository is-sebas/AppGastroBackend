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

    // Recorrer cada registro de pago en el objeto 'pago'
    for (const registro of pago) {
        db.query(
            sql, 
            [
                registro.id_cliente,
                registro.id_mesero,
                registro.metodoDePago,
                registro.montoPagado,
                new Date()
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                } else {
                    console.log('Id del nuevo pago: ', res.insertId);
                    result(null, res.insertId);
                }
            }
        );
    }

}

module.exports = Pago;