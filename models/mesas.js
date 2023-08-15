const db = require('../config/config')
var codigoAleatorio;

const Mesas = {}

Mesas.findById_Existe_Mesa = (id_mesa, result) => {
    const sql = `
    SELECT
        CONVERT(P.id_mesa, char) AS id,
        P.id_local,
        P.codigoqr,
        P.mesa_ubicacion,
        P.mesa_estado,
        P.total_cancelado,
        P.propina,
        P.pagado,
        CONVERT(P.id_staff, char) AS id_staff,
        p.mesa_fecha_crea,
        p.mesa_fecha_cierre
    FROM
        mesas as P
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
                console.log('Mesa obtenida:', res);
                result(null, res);
            }
        }
    );
}

Mesas.create = (mesas, result) => {

    const sql = `
    INSERT INTO
        mesas(
            codigoqr,
            id_local,
            mesa_ubicacion,
            mesa_estado,
            total_cancelado,
            propina,
            pagado,
            id_staff,
            mesa_fecha_crea,
            mesa_fecha_cierre
        )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    codigoAleatorio = Math.random().toString(36).substring(2, 8);

    db.query(
        sql, 
        [
            codigoAleatorio,
            mesas.id_local,
            mesas.mesa_ubicacion,
            1,
            0,
            0,
            "NO",
            mesas.id_staff,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id de la nueva mesa:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

Mesas.update = (mesas, result) => {

    const sql = `
    UPDATE
        mesas
    SET        
        mesa_ubicacion = ?,
        mesa_estado = ?,  
        total_cancelado = ?,
        propina = ?,
        pagado = ?,
        id_staff = ?,
        mesa_fecha_cierre = ?
    WHERE
        id_mesa = ?
    `;

    db.query(
        sql, 
        [
            mesas.mesa_ubicacion,
            mesas.mesa_estado,
            mesas.total_cancelado,
            mesas.propina,
            mesas.pagado,
            mesas.id_staff,
            new Date(),
            mesas.id_mesa
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Mesa actualizada:', mesas.id_mesa);
                result(null, mesas.id_mesa);
            }
        }
    )
}

Mesas.ListMesas = (id_local, result) => {
    const sql = `
    SELECT
        CONVERT(P.id_mesa, char) AS id,
        P.id_local,
        P.codigoqr,
        P.mesa_ubicacion,
        P.mesa_estado,
        P.total_cancelado,
        P.propina,
        P.pagado,
        CONVERT(P.id_staff, char) AS id_staff,
        p.mesa_fecha_crea,
        p.mesa_fecha_cierre
    FROM
        mesas as P
    WHERE 
        P.id_local = ?
    `;

    db.query(
        sql,
        [id_local],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Mesa del local:', res);
                result(null, res);
            }
        }
    );
}

Mesas.mostrarMesaUserCuenta = (id_mesa, id_usuarioActivo, result) => {

    const sql = `
SELECT 
    (SELECT
        SUM(oc.subTotal) AS totalSum
    FROM
        ordersCompart oc
    WHERE
        oc.id_mesa = ?
    AND 
        oc.id_usuarioActivo = ?) as totalUsuario,
    (SELECT
        SUM(oc.subTotal) AS totalSum
    FROM
        ordersCompart oc
    WHERE
        oc.id_mesa = ? ) as totalMesa,
    (SELECT
        SUM(oc.subTotal) AS totalSum
    FROM
        ordersCompart oc
    WHERE
        oc.id_mesa = ?
    AND 
        oc.id_usuarioActivo = ?
    AND oc.estado = 2) as totalPagado,
    (SELECT
        SUM(oc.subTotal) AS totalSum
    FROM
        ordersCompart oc
    WHERE
        oc.id_mesa = ?
    AND 
        oc.id_usuarioActivo = ?
    AND oc.estado = 1) as totalFaltante
FROM DUAL
    `;

    db.query(
        sql,
        [id_mesa, id_usuarioActivo, id_mesa, id_usuarioActivo, id_mesa, id_usuarioActivo, id_mesa, id_usuarioActivo],
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Estado de Mesa:', data);
                result(null, data);
            }
        }
    )
}

Mesas.GetMesaXQR = (codigoQR, result) => {
    const sql = `
    SELECT 
	    m.id_mesa,
	    m.id_local,
	    m.mesa_estado,
	    m.mesa_ubicacion
    FROM 
	    mesas m 
    WHERE
	    m.codigoqr = ?
    `;

    db.query(
        sql,
        [codigoQR],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Mesa obtenida por Código QR:', res);
                result(null, res);
            }
        }
    );
}

Mesas.updatePago = (mesas, result) => {

    const sql = `
    UPDATE
        mesas
    SET
        mesa_estado = ?,  
        total_cancelado = ?,
        pagado = ?,
        mesa_fecha_cierre = ?
    WHERE
        id_mesa = ?
    `;
    
    // Recorrer cada registro de mesa en el objeto 'mesas'
    for (const registro of mesas) {
        db.query(
            sql, 
            [
                registro.mesa_estado,
                registro.total_cancelado,
                registro.pagado,
                new Date(),
                registro.id_mesa
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Datos del pago de la mesa actualizado:', registro.id_mesa);
                    result(null, mesas.id_mesa);
                }
            }
        )
    }
}

Mesas.datosPago = (id_mesa, result) => {
    const sql = `
    SELECT 
        2 mesa_estado,
        sum(subTotal) total_cancelado,
        'SI' pagado,
        ? id_mesa
    FROM 
        ordersCompart
    WHERE 
        id_mesa = ?
    `;

    // Convierte id_mesa a número usando el operador +
    const idMesaNumber = +id_mesa;

    db.query(
        sql,
        [idMesaNumber, idMesaNumber],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Datos del pago de la mesa obtenida:', res);
                result(null, res);
            }
        }
    );
}

module.exports = Mesas;