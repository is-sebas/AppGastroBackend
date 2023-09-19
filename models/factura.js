const db = require('../config/config');

const Factura = {};

Factura.create = (factura, result) => {

    const sql = `
    INSERT INTO 
        facturas(
            id_local, 
            id_cliente,
            id_mesa,
            monto, 
            ruc,
            denominacion,
            gestor,
            nro_factura,
            detalle, 
            fecha)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        console.log('Factura.create');
        console.log('1. id_local: ', factura.id_local);
        console.log('2. id_cliente: ', factura.id_cliente);
        console.log('3. id_mesa: ', factura.id_mesa);
        console.log('4. monto: ', factura.monto);
        console.log('5. ruc: ', factura.ruc);
        console.log('6. denominacion: ', factura.denominacion);
        console.log('7. gestor: ', factura.gestor);
        console.log('8. nro_factura: ', factura.nro_factura);
        console.log('9. detalle: ', factura.detalle);

        db.query(
            sql, 
            [
                factura.id_local, 
                factura.id_cliente,
                factura.id_mesa,
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

Factura.GetFacturaHTML = (id_mesa, result) => {
    const sql = `
    SELECT 
        f.detalle 
    FROM
        facturas f 
    WHERE 
        f.id_mesa = ?
    `;

    console.log('id_mesa:', id_mesa);

    db.query(
        sql,
        [id_mesa],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Detalle de Factura Obtenido:', res);
                result(null, res);
            }
        }
    );
}


module.exports = Factura;