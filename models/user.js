const db = require("../config/config");
const bcrypt = require("bcryptjs");

const User = {};

User.findById = (id, result) => {
  const sql = `
  SELECT
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.image,
    U.phone,
    U.password,
    U.denominacion,
    U.ruc,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', CONVERT(R.id, char),
            'name', R.name,
            'image', R.image,
            'route', R.route,
            'id_local', CASE WHEN UHR.id_local IS NULL THEN '' ELSE UHR.id_local END,
            'loc_nombre', CASE WHEN l.loc_nombre IS NULL THEN '' ELSE l.loc_nombre END
        )
    ) AS roles
    FROM
      users AS U
    INNER JOIN
      user_has_roles AS UHR
    ON
      UHR.id_user = U.id
    INNER JOIN
      roles AS R
    ON
      UHR.id_rol = R.id
    LEFT JOIN
      locales AS l
    ON
      l.id_local = UHR.id_local
    WHERE
      U.id = ?
    GROUP BY
      U.id
    `;

  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario obtenido:", user[0]);
      result(null, user[0]);
    }
  });
};

User.findDeliveryMen = (result) => {
  const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.denominacion,
        U.ruc
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id 
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2;
    `;

  db.query(sql, (err, data) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      result(null, data);
    }
  });
};

User.findByEmail = (email, result) => {
  const sql = `
  SELECT
  U.id,
  U.email,
  U.name,
  U.lastname,
  U.image,
  U.phone,
  U.password,
  U.denominacion,
  U.ruc,
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'id', CONVERT(R.id, char),
          'name', R.name,
          'image', R.image,
          'route', R.route,
          'id_local', CASE WHEN UHR.id_local IS NULL THEN '' ELSE UHR.id_local END,
          'loc_nombre', CASE WHEN l.loc_nombre IS NULL THEN '' ELSE l.loc_nombre END
      )
  ) AS roles
FROM
  users AS U
INNER JOIN
  user_has_roles AS UHR
ON
  UHR.id_user = U.id
INNER JOIN
  roles AS R
ON
  UHR.id_rol = R.id
LEFT JOIN
  locales AS l
ON
  l.id_local = UHR.id_local
WHERE
  U.email = ?
GROUP BY
  U.id
`;

  db.query(sql, [email], (err, user) => {
    console.log("el error es", err, user);
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario obtenido:", user[0]);
      result(null, user[0]);
    }
  });
};

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);

  const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      user.email,
      user.name,
      user.lastname,
      user.phone,
      user.image,
      hash,
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Id del nuevo usuario:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};

User.update = (user, result) => {
  const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        image = ?,
        denominacion = ?,
        ruc = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

  db.query(
    sql,
    [user.name, user.lastname, user.phone, user.image, user.denominacion, user.ruc, new Date(), user.id],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Usuario actualizado:", user.id);
        result(null, user.id);
      }
    }
  );
};

User.updateWithoutImage = (user, result) => {
  const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        denominacion = ?,
        ruc = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

  db.query(
    sql,
    [user.name, user.lastname, user.phone, user.denominacion, user.ruc, new Date(), user.id],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Usuario actualizado:", user.id);
        result(null, user.id);
      }
    }
  );
};

User.updateNotificationToken = (id, token, result) => {
  const sql = `
    UPDATE
        users
    SET
        notification_token = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

  db.query(sql, [token, new Date(), id], (err, res) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario actualizado:", id);
      result(null, id);
    }
  });
};

User.GetRolUser = (id, result) => {
  const sql = `
    SELECT (SELECT u.name
              FROM users u 
             WHERE u.id = uhr.id_user) as Nombre_Usuario,
           uhr.id_local,
           (SELECT l.loc_nombre
              FROM locales l 
             WHERE l.id_local = uhr.id_local) loc_nombre,
           uhr.id_rol,
          CASE WHEN uhr.id_rol = 1 THEN
              'ADMIN'
          WHEN uhr.id_rol = 2 THEN
              'REPARTIDOR'
          ELSE
              'CLIENTE'
          END as Rol
    FROM 
      user_has_roles uhr
    WHERE 
      uhr.id_user = ?
    `;

  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Datos Rol de usuario:", user);
      result(null, user);
    }
  });
};

User.createUserTemp = async (user, result) => {

  const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                denominacion,
                ruc,
                created_at
            )
        VALUES(?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      user.email,
      user.name,
      user.lastname,
      user.denominacion,
      user.ruc,
      new Date()
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Id del usuario temporal:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};


User.datosFacturaUser = (id, result) => {
  const sql = `
    select 
      u.ruc,
      u.denominacion,
      u.phone,
      u.email
    from 
      users u 
    where 
      u.id = ?
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
              console.log('Datos de la factura del usuario:', res);
              result(null, res);
          }
      }
  );
}

User.datosInsertFactura = (id_user, id_mesa, nro_factura, detalle, result) => {
  const sql = `
        SELECT (SELECT
                    m.id_local
                  FROM 
                    mesas m
                  WHERE
                    m.id_mesa = ?) as 'id_local',
            ? as 'id_cliente',
            u.ruc as 'ruc',
            ? as 'id_mesa',
            u.denominacion as 'denominacion',
          (SELECT
            concat(u.name, ' ', u.lastname)
          FROM
            users u
          WHERE
            u.id in (SELECT
                  m.id_staff
                  FROM 
                  mesas m
                  WHERE
                  m.id_mesa = ?)) 'gestor',
          ? as 'nro_factura',
          ? as 'detalle'
        FROM 
          users u
        WHERE
          u.id  = ?
      `;

  db.query(
      sql,
      [id_mesa, id_user, id_mesa, id_mesa, nro_factura, detalle, id_user],
      (err, res) => {
          if (err) {
              console.log('Error:', err);
              result(err, null);
          }
          else {
              console.log('Datos para insertar facturas:', res);
              result(null, res);
          }
      }
  );
}

module.exports = User;