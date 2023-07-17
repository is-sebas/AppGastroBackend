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

module.exports = OrdersCompart;