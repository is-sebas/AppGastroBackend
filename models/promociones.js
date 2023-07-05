const db = require('../config/config');

const Promocion = {};

Promocion.getAll = (result) => {
    const sql = `
    SELECT
        CONVERT(id_promocion ) AS id, 
        pro_nombre, 
        id_local, 
        pro_descripcion, 
        pro_imagen, 
        pro_estado, 
        pro_creado, 
        pro_update
    FROM
        promociones
    ORDER BY
        pro_nombre
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Promociones:', data);
                result(null, data);
            }
        }
    );
}

module.exports = Promocion;