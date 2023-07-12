const db = require('../config/config')

const PedidoLog = {}

PedidoLog.create = (pedidoLog, result) => {

    const sql = `
    INSERT INTO
        pedidoLog(
            id_mesa,
            id_orders,
            estadoPedido,
            costoTotal,
            idProducto,
            descripcion,
            cantidad,
            subTotal,
            fechaSolicitud,
            fechaEntrega
        )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            pedidoLog.id_mesa,
            pedidoLog.id_orders,
            pedidoLog.estadoPedido,
            pedidoLog.costoTotal,
            pedidoLog.idProducto,
            pedidoLog.descripcion,
            pedidoLog.cantidad,
            pedidoLog.subTotal,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo log:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

PedidoLog.listLogsMesas = (id_mesa, result) => {
    const sql = `
    SELECT
        id_log, 
	    id_mesa, 
	    id_orders, 
	    estadoPedido, 
	    costoTotal, 
	    idProducto, 
	    descripcion, 
	    cantidad, 
	    subTotal, 
	    fechaSolicitud, 
	    fechaEntrega
    FROM
        pedidoLog as P
    WHERE 
        P.id_mesa = ?
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
                console.log('Logs de la mesa:', res);
                result(null, res);
            }
        }
    );
}

PedidoLog.listLogsOrders = (id_orders, result) => {
    const sql = `
    SELECT
        id_log, 
	    id_mesa, 
	    id_orders, 
	    estadoPedido, 
	    costoTotal, 
	    idProducto, 
	    descripcion, 
	    cantidad, 
	    subTotal, 
	    fechaSolicitud, 
	    fechaEntrega
    FROM
        pedidoLog as P
    WHERE 
        P.id_orders = ?
    `;

    db.query(
        sql,
        [id_orders],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Logs de Orders:', res);
                result(null, res);
            }
        }
    );
}

PedidoLog.update = (pedidoLog, result) => {

    const sql = `
    UPDATE
        pedidoLog
    SET        
        id_mesa = ?,
	    id_orders = ?,
	    estadoPedido = ?, 
	    costoTotal = ?,
	    idProducto = ?,
	    descripcion = ?,
	    cantidad = ?,
	    subTotal = ?,
	    fechaSolicitud = ?,
	    fechaEntrega = ?
    WHERE
        id_log = ?
    `;

    db.query(
        sql, 
        [
            pedidoLog.id_mesa,
            pedidoLog.id_orders,
            pedidoLog.estadoPedido,
            pedidoLog.costoTotal,
            pedidoLog.idProducto,
            pedidoLog.descripcion,
            pedidoLog.cantidad,
            pedidoLog.subTotal,
            new Date(),
            new Date(),
            pedidoLog.id_log
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Mesa actualizada:', pedidoLog.id_log);
                result(null, pedidoLog.id_log);
            }
        }
    )
}

module.exports = PedidoLog;