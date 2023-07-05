const Locales = require('../models/locales');

module.exports = {

    async getAll(req, res) {

        Locales.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los locales',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    async findById_Local(req, res) {
        const id_local = req.params.id_local;

        Locales.findById_local(id_local, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los locales',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    async create(req, res) {

        const local = JSON.parse(req.body.locales); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;
        
        let inserts = 0; 
        
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el local no tiene imagen',
            });
        }
        else {
            Locales.create(local, (err, id_local) => {

        
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del local',
                        error: err
                    });
                }
                
                local.id = id_local;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // CREO LA IMAGEN EN FIREBASE
                            if (inserts == 0) { //IMAGEN 1
                                product.image1 = url;
                            }
                        }

                        await Locales.update(local, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con el registro del local',
                                    error: err
                                });
                            }

                            if (inserts == files.length) { // TERMINO DE ALAMACENAR LAS TRES IMAGENES
                                return res.status(201).json({
                                    success: true,
                                    message: 'El local se almaceno correctamente',
                                    data: data
                                });
                            }

                        });
                    });
                }
    
                start();
    
            });
        }

    },

    async update(req, res) {
        const local = req.body;

        Locales.update(local, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización del local',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El local se actualizo correctamente',
                data: data
            });
        })
    },

    async updateWithImage(req, res) {

        const local = JSON.parse(req.body.locales); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;
        
        let inserts = 0; 
        
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el local no tiene imagen',
            });
        }
        else {
            Locales.update(local, (err, id_local) => {

        
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualización del local',
                        error: err
                    });
                }
                
                local.id = id_local;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // CREO LA IMAGEN EN FIREBASE
                            if (inserts == 0) { //IMAGEN 1
                                product.image1 = url;
                            }
                        }

                        await Locales.update(local, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con la actualización del local',
                                    error: err
                                });
                            }

                            if (inserts == files.length) { // TERMINO DE ALAMACENAR LAS TRES IMAGENES
                                return res.status(201).json({
                                    success: true,
                                    message: 'El local se actualizo correctamente',
                                    data: data
                                });
                            }

                        });
                    });
                }
    
                start();
    
            });
        }

    },

    async delete(req, res) {
        const id = req.params.id;

        Locales.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el local',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El local se elimino correctamente',
                data: `${id}`
            });
        });
    },

}