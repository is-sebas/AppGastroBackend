const User = require("../models/user");
const Rol = require("../models/rol");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const storage = require("../utils/cloud_storage");
const UsuariosActivos = require('../models/usuariosActivos');

module.exports = {
  findDeliveryMen(req, res) {
    User.findDeliveryMen((err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con al listar los repartidores",
          error: err,
        });
      }

      return res.status(201).json(data);
    });
  },

  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      console.log("Error ", err);
      console.log("USUARIO ", myUser);

      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      if (!myUser) {
        return res.status(401).json({
          // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
          success: false,
          message: "El email no fue encontrado",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    denominacion: myUser.denominacion,
                    ruc: myUser.ruc,
                    session_token: `JWT ${token}`,
                    //roles: JSON.parse(myUser.roles)
                    roles: myUser.roles
                  }
                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
                });
            }
            else {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
    });
  },

  register(req, res) {
    const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El registro se realizo correctamente",
        data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      });
    });
  },
  async registerWithImage(req, res) {
    const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;

    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path);

      if (url != undefined && url != null) {
        user.image = url;
      }
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      user.id = `${data}`;
      const token = jwt.sign(
        { id: user.id, email: user.email },
        keys.secretOrKey,
        {}
      );
      user.session_token = `JWT ${token}`;

      Rol.create(user.id, 3, (err, data) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Hubo un error con el registro del rol de usuario",
            error: err,
          });
        }

        return res.status(201).json({
          success: true,
          message: "El registro se realizo correctamente",
          data: user,
        });
      });
    });
  },

  async updateWithImage(req, res) {
    const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;

    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path);

      if (url != undefined && url != null) {
        user.image = url;
      }
    }

    User.update(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El usuario se actualizo correctamente",
        data: user,
      });
    });
  },

  async updateWithoutImage(req, res) {
    const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    console.log("DATA DEL CLIENTE ", user);

    User.updateWithoutImage(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El usuario se actualizo correctamente",
        data: user,
      });
    });
  },
  async updateNotificationToken(req, res) {
    const id = req.body.id;
    const token = req.body.token;
    console.log("ID ", id);
    console.log("TOKEN ", token);

    User.updateNotificationToken(id, token, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El token se actualizo correctamente",
        data: id,
      });
    });
  },

  async GetRolUser(req, res) {
    const id = req.params.id;

    User.GetRolUser(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con al listar la información del Rol",
          error: err,
        });
      }

      return res.status(200).json(data);
    });
  },

  async createUserTemp(req, res) {
    const user = req.body;

    User.createUserTemp(user, async (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }
        const idMesa = user.usuariosActivos[0].id_mesa;
        const idLocal = user.usuariosActivos[0].id_local;

        await UsuariosActivos.createTemp(data, idMesa, idLocal, (err, id_data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario activo',
                    error: err
                });
            }
        });

        return res.status(201).json({
          success: true,
          message: "El registro se realizo correctamente",
          data: user,
        });
      });
  },

  async datosFacturaUser(req, res) {
    const id = req.params.id;

    User.datosFacturaUser(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con al listar la información de la factura del usuario",
          error: err,
        });
      }

      return res.status(200).json(data);
    });
  },

  async datosInsertFactura(req, res) {
    const id_user = req.params.id_user;
    const id_mesa = req.params.id_mesa;
    const monto = req.params.monto;
    const nro_factura = req.params.nro_factura;
    const detalle = req.params.detalle;

    User.datosInsertFactura(id_user, id_mesa, monto, nro_factura, detalle, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al listar la información de la factura a insertar",
          error: err,
        });
      }

      return res.status(200).json(data);
    });
  },

}
