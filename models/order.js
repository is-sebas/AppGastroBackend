const db = require('../config/config');

const Order = {};

Order.findByStatus = (status, result) => {

    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_address, char) AS id_address,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.status,
        O.timestamp,
        O.id_mesa,
        JSON_OBJECT(
            'id', CONVERT(A.id, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) AS address,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity
            )
        ) AS products
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
    LEFT JOIN
        users AS U2
    ON
        U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 
    INNER JOIN
        order_has_products AS OHP
    ON
        OHP.id_order = O.id
    INNER JOIN
        products AS P
    ON
        P.id = OHP.id_product
    WHERE 
        status = ?
    GROUP BY
        O.id;
    `;

    db.query(
        sql,
        status,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    )
}

Order.findByDeliveryAndStatus = (id_delivery, status, result) => {

    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_address, char) AS id_address,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.status,
        O.timestamp,
        O.id_mesa,
        JSON_OBJECT(
            'id', CONVERT(A.id, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) AS address,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity
            )
        ) AS products
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
    LEFT JOIN
        users AS U2
    ON
        U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 
    INNER JOIN
        order_has_products AS OHP
    ON
        OHP.id_order = O.id
    INNER JOIN
        products AS P
    ON
        P.id = OHP.id_product
    WHERE 
        O.id_delivery = ? AND O.status = ?
    GROUP BY
        O.id;
    `;

    db.query(
        sql,
        [id_delivery, status],
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    )
}

Order.findByClientAndStatus = (id_client, status, result) => {

    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_address, char) AS id_address,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.status,
        O.timestamp,
        O.id_mesa,
        JSON_OBJECT(
            'id', CONVERT(A.id, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) AS address,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity 
            )
        ) AS products
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
    LEFT JOIN
        users AS U2
    ON
        U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 
    INNER JOIN
        order_has_products AS OHP
    ON
        OHP.id_order = O.id
    INNER JOIN
        products AS P
    ON
        P.id = OHP.id_product
    WHERE 
        O.id_client = ? AND O.status = ?
    GROUP BY
        O.id;
    `;

    db.query(
        sql,
        [id_client, status],
        (err, data) => {
            if (err) {
                console.log('Error EN ORDER findByClientAndStatus:', err);
                //console.log('Error EN ORDER findByClientAndStatus:', data);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    )
}

Order.create = (order, result) => {

    const sql = `
    INSERT INTO
        orders(
            id_client,
            id_address,
            status,
            timestamp,
            id_mesa,
            created_at,
            updated_at   
        )
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            order.id_client,
            order.id_address,
            'EN CAMINO', // 1. PAGADO 2. DESPACHADO 3. EN CAMINO 4. ENTREGADO
            Date.now(),
            order.id_mesa,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id de la nueva orden:', res.insertId);
                result(null, res.insertId);
            }
        }

    )

}

Order.updateToDispatched = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'DESPACHADO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Order.updateToOnTheWay = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'EN CAMINO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Order.updateToDelivered = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'ENTREGADO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Order.listaConsumoMesa = (id_mesa, result) => {

    const sql = `
            SELECT 	
                o.id id_orden,
                (SELECT u.name AS 'SolicitadoPor'
                FROM users u
                WHERE u.id = ua.id_usuario) nombre,
                ua.id_usuario user_id,
                p.name producto,
                p.price * ohp.quantity total,
                ohp.quantity cantidad,
                CASE WHEN (ohp.quantity > 1) THEN
                    'SI'
                ELSE
                    'NO'
                END AS 'dividido',
                o.status AS 'estadoOrden'
            FROM 
                orders o 
            INNER JOIN
                order_has_products ohp 
            ON
                o.id = ohp.id_order
            INNER JOIN
                usuariosActivos ua 
            ON
                o.id_client = ua.id_usuario
            INNER JOIN
                products p 
            ON
                ohp.id_product = p.id 
            INNER JOIN 
                ordersCompart oc 
            ON
                o.id = oc.OrdersID
            INNER JOIN 
                mesas m
            ON
                o.id_mesa = m.id_mesa
            WHERE
                m.id_mesa = ?
            GROUP BY
                o.id, p.name, ohp.quantity,o.status, oc.subTotal 
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
                console.log('Listado de consumo por Mesa:', res);
                result(null, res);
            }
        }
    )
}

Order.listaConsumoDetalle = (id_orden, result) => {

    const sql = `
                SELECT 	
                    p.name nombreProducto,
                    ohp.quantity cantidad,
                    p.price costoUnitario,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', u.id,
                            'nombre', u.name,
                            'montoAPagar', oc.subTotal,
                            'estado', CASE WHEN oc.estado = 0 THEN 'Inactivo'
                                        WHEN oc.estado = 1 THEN 'Pendiente'
                                        WHEN oc.estado = 2 THEN 'Pagado'
                                        ELSE 'Eliminado' END)
                    ) AS listado
                FROM 
                    orders o 
                INNER JOIN
                    order_has_products ohp 
                ON
                    o.id = ohp.id_order
                INNER JOIN
                    usuariosActivos ua 
                ON
                    o.id_client = ua.id_usuario
                INNER JOIN
                    products p 
                ON
                    ohp.id_product = p.id 
                INNER JOIN 
                    ordersCompart oc 
                ON
                    o.id = oc.OrdersID
                INNER JOIN 
                    users u 
                ON
                    oc.id_usuarioActivo = u.id
                WHERE
                    o.id = ?
                GROUP BY
	                p.name
                `;

    db.query(
        sql,
        [id_orden],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado detallado por Orden:', res);
                result(null, res);
            }
        }
    )
}

Order.getListadoConsumicion = (id_mesa, result) => {

    const sql = `
            SELECT  
                o.id id_orden,
                (SELECT concat(u.name, ' ', u.lastname) AS 'SolicitadoPor'
                FROM users u
                WHERE u.id = ua.id_usuario) nombre,
                p.name producto,
                P.price precio,
                ohp.quantity cantidad,
                p.price * ohp.quantity total,
                CASE WHEN (ohp.quantity > 1) THEN
                    'SI'
                ELSE
                    'NO'
                END AS 'dividido',
                o.status AS 'estadoOrden',
                JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'nombre', CONCAT(u.name, ' ', u.lastname),
                            'montoAPagar', oc.subTotal,
                            'estado', CASE WHEN oc.estado = 0 THEN 'Inactivo'
                                        WHEN oc.estado = 1    THEN 'Pendiente'
                                        WHEN oc.estado = 2    THEN 'Pagado'
                                        ELSE 'Eliminado' END)
                    ) AS listado
                FROM 
                    orders o 
                INNER JOIN
                    order_has_products ohp 
                ON
                    o.id = ohp.id_order
                INNER JOIN  
                    usuariosActivos ua 
                ON
                    o.id_client = ua.id_usuario
                INNER JOIN
                    products p 
                ON
                    ohp.id_product = p.id 
                INNER JOIN 
                    ordersCompart oc 
                ON
                    o.id = oc.OrdersID
                INNER JOIN 
                        users u 
                    ON
                        oc.id_usuarioActivo = u.id
                INNER JOIN 
                    mesas m
                ON
                    o.id_mesa = m.id_mesa
                WHERE
                    m.id_mesa = ?
                GROUP BY
                    o.id, p.name, ohp.quantity,o.status
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
                console.log('Listado de consumición por Mesa:', res);
                result(null, res);
            }
        }
    )
}

module.exports = Order;