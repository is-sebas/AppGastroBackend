const db = require('../config/config');

const Factura = {};

Factura.create = (id_local, id_cliente, id_mesa, ruc, denominacion, gestor, nro_factura, detalle, result) => {

    const sql = `
    INSERT INTO 
        facturas(
            id_local, 
            id_cliente,
            id_mesa,
            ruc,
            denominacion,
            gestor,
            nro_factura,
            detalle, 
            fecha)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        console.log('Factura.create');
        console.log('1. id_local: ', id_local);
        console.log('2. id_cliente: ', id_cliente);
        console.log('3. id_mesa: ', id_mesa);
        console.log('4. ruc: ', ruc);
        console.log('5. denominacion: ', denominacion);
        console.log('6. gestor: ', gestor);
        console.log('7. nro_factura: ', nro_factura);
        console.log('8. detalle: ', detalle);

        db.query(
            sql, 
            [
                id_local, 
                id_cliente,
                id_mesa,
                ruc,
                denominacion,
                gestor,
                nro_factura,
                detalle,
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