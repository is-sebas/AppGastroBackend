const db = require('../config/config');

const Promocion = {};

Promocion.list_promociones = (result) => {
    const sql = `
    SELECT
        CONVERT(P.id_promocion ) AS id, 
        P.pro_nombre, 
        P.id_local, 
        P.pro_descripcion, 
        P.pro_imagen, 
        P.pro_estado, 
        P.pro_creado, 
        P.pro_update
    FROM
        promociones as P
    `;

    db.query(
        sql,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Listado de Promociones:', res);
                result(null, res);
            }
        }
    );
}

module.exports = Promocion;