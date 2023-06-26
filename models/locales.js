const db = require('../config/config');

const Locales = {};

Locales.findById_local = (id_local, result) => {
    const sql = `
    SELECT
        CONVERT(P.id_local, char) AS id,
        P.loc_nombre,
        P.loc_descripcion,
        P.loc_imagen,
        P.loc_estado,
        CONVERT(P.id_categoria, char) AS id_categoria
    FROM
        locales as P
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
                console.log('Local obtenido:', res);
                result(null, res);
            }
        }
    );
}

Locales.create = (locales, result) => {

    const sql = `
    INSERT INTO
        locales(
            loc_nombre,
            loc_descripcion,
            loc_imagen,
            loc_estado,
            id_categoria,
            loc_creado,
            loc_update
        )
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            locales.loc_nombre,
            locales.loc_descripcion,
            locales.loc_imagen,
            locales.loc_estado,
            locales.id_categoria,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo local:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}


Locales.update = (locales, result) => {

    const sql = `
    UPDATE
        locales
    SET
        loc_nombre = ?, 
        loc_descripcion = ?,
        loc_imagen = ?,
        loc_estado = ?, 
        id_categoria = ?,  
        loc_update = ?
    WHERE
        id_local = ?
    `;

    db.query(
        sql, 
        [
            locales.loc_nombre,
            locales.loc_descripcion,
            locales.loc_imagen,
            locales.loc_estado,
            locales.id_categoria,
            new Date(),
            locales.id_local
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Local actualizado:', locales.id_local);
                result(null, product.id);
            }
        }
    )
}

Locales.delete = (id_local, result) => {
    const sql = `
    DELETE FROM
        locales
    WHERE
        id_local = ?
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
                console.log('Id del local eliminado:', id_local);
                result(null, id_local);
            }
        }
    )
}

module.exports = Locales;