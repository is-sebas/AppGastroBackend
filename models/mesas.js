const db = require('../config/config')
import QRCode from 'qrcode'

const Mesas = {}

Mesas.findById_Existe_Mesa = (id_mesa, result) => {
    const sql = `
    SELECT
        CONVERT(P.id_mesa, char) AS id,
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

Mesas.create = (Mesas, result) => {

    const sql = `
    INSERT INTO
        mesas(
            id_mesa,
            codigoqr,
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

    var codigoqr = QRCode.toDataURL(cadenaAleatoria, function (err, url) {
      console.log(url)
    })

    db.query(
        sql, 
        [
            Mesas.id_mesa,
            codigoqr,
            Mesas.mesa_ubicacion,
            Mesas.mesa_estado,
            Mesas.total_cancelado,
            Mesas.propina,
            Mesas.pagado,
            Mesas.id_staff,
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

Mesas.update = (Mesas, result) => {

    const sql = `
    UPDATE
        mesas
    SET
        id_mesa = ?, 
        codigoqr = ?, 
        mesa_ubicacion = ?, 
        mesa_estado = ?,  
        total_cancelado = ?,
        propina = ?,
        id_staff = ?,
        mesa_fecha_crea = ?,
        mesa_fecha_cierre = ?
    WHERE
        id_mesa = ?
    `;

    db.query(
        sql, 
        [
            Mesas.id_mesa,
            Mesas.codigoqr,
            Mesas.mesa_ubicacion,
            Mesas.mesa_estado,
            Mesas.total_cancelado,
            Mesas.propina,
            Mesas.pagado,
            Mesas.id_staff,
            new Date(),
            Mesas.id_mesa
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Mesa actualizado:', Mesas.id_mesa);
                result(null, product.id);
            }
        }
    )
}

Mesas.delete = (id_mesa, result) => {
    const sql = `
    DELETE FROM
        mesas
    WHERE
        id_mesa = ?
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
                console.log('Id de la mesa eliminado:', id_mesa);
                result(null, id_mesa);
            }
        }
    )
}

module.exports = Mesas;