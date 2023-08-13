const Reportes = require('../models/reportes');
const PDFGenerator = require('../utils/generatePDF'); // Ajusta la ruta según tu estructura de carpetas

module.exports = {
    
    async getReporteUsuario(req, res) {
        const id_user = req.params.id_user;
        const fecha_desde = req.params.fecha_desde;
        const fecha_hasta = req.params.fecha_hasta;

        Reportes.getReporteUsuario(id_user, fecha_desde, fecha_hasta, async (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del reporte para usuarios',
                    error: err
                });
            }

            return res.status(200).json(data);        
        });
    },

    async getReporteComercioOnline(req, res) {
        const id_local = req.params.id_local;

        Reportes.getReporteComercioOnline(id_local, async (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del reporte online para comercios',
                    error: err
                });
            }

            return res.status(200).json(data);        
        });
    },

    async getReporteComercioRangoFecha(req, res) {
        const id_local = req.params.id_local;
        const fecha_desde = req.params.fecha_desde;
        const fecha_hasta = req.params.fecha_hasta;

        Reportes.getReporteComercioRangoFecha(id_local,fecha_desde, fecha_hasta, async (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del reporte por rango de fechas para comercios',
                    error: err
                });
            }

            return res.status(200).json(data);        
        });
    }
}