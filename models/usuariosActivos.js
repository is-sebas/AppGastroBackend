const db = require('../config/config');

const UsuarioActivo = {};

UsuarioActivo.findByUsuariosActivos = (id_usuario, result) => {
    const sql = `
    SELECT
        CONVERT(P.id_usuario, char) AS id,
        CONVERT(P.id_mesa, char) AS id_mesa,
        CONVERT(P.id_local, char) AS id_mesa,
        P.estado,
        P.monto_pagado,
        P.es_temporal,
        P.ingreso,
        P.salida
    FROM
        usuariosActivos as P
    WHERE 
        P.id_usuario = ?
    `;

    db.query(
        sql,
        [id_usuario],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario activo:', res);
                result(null, res);
            }
        }
    );
}

UsuarioActivo.create = (usuariosActivos, result) => {

    const sql = `
    INSERT INTO
        UsuarioActivo(
            id_mesa,
            id_local,
            estado,
            monto_pagado,
            es_temporal,
            ingreso,
            salida
        )
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            usuariosActivos.id_mesa,
            usuariosActivos.id_local,
            usuariosActivos.estado,
            usuariosActivos.monto_pagado,
            usuariosActivos.es_temporal,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario activo:', res.insertId);
                result(null, res.insertId);
            }
        }

    )

}

UsuarioActivo.update = (usuariosActivos, result) => {

    const sql = `
    UPDATE
        usuarioActivo
    SET
        id_mesa = ?,
        id_local = ?,
        estado = ?,
        monto_pagado = ?,
        es_temporal = ?,
        ingreso = ?,
        salida = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            usuariosActivos.id_mesa,
            usuariosActivos.id_local,
            usuariosActivos.estado,
            usuariosActivos.monto_pagado,
            usuariosActivos.es_temporal,
            new Date(),
            new Date(),
            usuariosActivos.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del usuario activo actualizado:', usuariosActivos.id);
                result(null, usuariosActivos.id);
            }
        }
    )
}

UsuarioActivo.delete = (id, result) => {
    const sql = `
    DELETE FROM
        usuariosActivos
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
                console.log('Id del usuario activo eliminado:', id);
                result(null, id);
            }
        }
    )
}

module.exports = UsuarioActivo;