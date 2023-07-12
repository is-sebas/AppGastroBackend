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
            mesas.mesa_estado,
            mesas.total_cancelado,
            mesas.propina,
            mesas.pagado,
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
                console.log('Mesa actualizada:', Mesas.id_mesa);
                result(null, mesas.id);
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

module.exports = Mesas;