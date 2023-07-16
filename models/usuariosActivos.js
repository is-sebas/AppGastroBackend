const db = require('../config/config');
const UsuarioActivo = {};

UsuarioActivo.ListUsersActivos = (result) => {
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
        P.estado = 1
    `;

    db.query(
        sql,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Usuarios Activos:', res);
                result(null, res);
            }
        }
    );
}

UsuarioActivo.ListUserMesas = (id_mesa, status, result) => {

    const sql = `
    SELECT id_usuario, 
		id_mesa, 
		id_local, 
		estado, 	
		monto_pagado, 
		es_temporal, 
		ingreso, 
		salida,
		JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS users
		
    FROM gastro_db.usuariosActivos ua
    INNER JOIN
        users AS U
    ON
        U.id = ua.id_usuario
    WHERE ua.id_mesa = ?
        AND ua.estado = ?
    ORDER BY
        ua.id_usuario

    `;

    db.query(
        sql,
        [id_mesa, status],
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Usuarios en mesa:', data);
                result(null, data);
            }
        }
    )
}

UsuarioActivo.ListUsersInactivos = (result) => {
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
        P.estado = 0
    `;

    db.query(
        sql,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Usuarios Inactivos:', res);
                result(null, res);
            }
        }
    );
}

UsuarioActivo.create = (usuariosActivos, result) => {

    const sql = `
    INSERT INTO
        usuariosActivos(
            id_usuario,
            id_mesa,
            id_local,
            estado,
            monto_pagado,
            es_temporal,
            ingreso,
            salida
        )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            usuariosActivos.id_usuario,
            usuariosActivos.id_mesa,
            usuariosActivos.id_local,
            usuariosActivos.estado,
            usuariosActivos.monto_pagado,
            usuariosActivos.es_temporal,
            new Date(),
            new Date()
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
        usuariosActivos
    SET
        estado = ?,
        monto_pagado = ?,
        salida = ?
    WHERE
        id_usuario = ?
    `;

    db.query(
        sql, 
        [
            usuariosActivos.estado,
            usuariosActivos.monto_pagado,
            new Date(),
            usuariosActivos.id_usuario
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario activo actualizado:', usuariosActivos.id_usuario);
                result(null, usuariosActivos.id_usuario);
            }
        }
    )
}

UsuarioActivo.delete = (id, result) => {
    const sql = `
    DELETE FROM
        usuariosActivos
    WHERE
        id_usuario = ?
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