const db = require('../config/config')

const OrdersCompart = {}

OrdersCompart.create = (ordersCompart, result) => {

    const sql = `
    INSERT INTO
        ordersCompart(
            OrdersID,
            id_usuarioActivo,
            id_mesa,
            estado,
            subTotal
        )
    VALUES(?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            ordersCompart.OrdersID,
            ordersCompart.id_usuarioActivo,
            ordersCompart.id_mesa,
            ordersCompart.estado,
            ordersCompart.subTotal
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Registro realizado con Exito');
                result(null, res);
            }
        }
    )
}

OrdersCompart.ListOrdersCompart = (result) => {
    const sql = `
    SELECT
        P.OrdersID,
        P.id_usuarioActivo,
        P.id_mesa,
        P.estado,
        P.subTotal
    FROM
        ordersCompart as P
    ORDER BY
        P.OrdersID
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Orders Compart:', data);
                result(null, data);
            }
        }
    );
}


OrdersCompart.updateEstado = (id, estado, result) => {
    const sql = `
    UPDATE 
        ordersCompart
    SET
        estado = ?
    WHERE id = ?;
    `;

    db.query(
        sql, 
        [
            estado,
            id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Estado de la orden compartida actualizada:', id);
                result(null, id);
            }
        }
    )
}

OrdersCompart.getOrdenes = (id, result) => {
    const sql = `
    SELECT
        OrdersID,
        id_usuarioActivo,
        id_mesa,
        subTotal
    FROM
        ordersCompart
    WHERE
        id = ?
    `;

    db.query(
        sql,
        [id],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de ordenes:', res);
                result(null, res);
            }
        }
    );
}

OrdersCompart.getCumpleCondicion = (id_mesa, result) => {
    const sql = `
    SELECT 
        OrdersID,
        CASE
            WHEN COUNT(*) = SUM(CASE WHEN estado = 2 THEN 1 ELSE 0 END) THEN 'SI'
            ELSE 'NO'
        END AS cumple_condicion
    FROM 
        ordersCompart
    WHERE 
        id_mesa = ?
    GROUP BY 
        OrdersID
    `;

    db.query(
        sql,
        [id_mesa],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de ordenes por condición:', res);
                result(null, res);
            }
        }
    );
}

OrdersCompart.getDatosPago = (OrderID, result) => {
    const sql = `
    SELECT
        oc.id id_order_compart,
        'Online' metododepago
    FROM 
        ordersCompart oc
    WHERE
        oc.OrdersID = ?
    `;

    db.query(
        sql,
        [OrderID],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de ordenes compartidas para el pago:', res);
                result(null, res);
            }
        }
    );
}

module.exports = OrdersCompart;