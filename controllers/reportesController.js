const Reportes = require('../models/reportes');
const PDFGenerator = require('../utils/generatePDF'); // Ajusta la ruta según tu estructura de carpetas

class ReportGeneratorUser {
    constructor(data) {
        this.data = data;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('es-ES', options);
    }

    generateHTMLReport() {
        const reportTable = this.data.map(item => `
            <tr>
                <td>${item.local}</td>
                <td>${item.mesero}</td>
                <td>${item.mesa}</td>
                <td>${this.formatDate(item.fechaPago)}</td>
                <td>${this.formatCurrency(item.montoPagado)}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>

            <head>
                <title>Reporte para Usuarios</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }

                    th {
                        background-color: #f2f2f2;
                    }
                    h1 {
                        text-align: center;
                    }
                </style>
            </head>

            <body>
                <h1>Reporte para Usuarios</h1>
                <table>
                    <tr>
                        <th>Local</th>
                        <th>Mesero</th>
                        <th>Mesa</th>
                        <th>Fecha de Pago</th>
                        <th>Monto Pagado</th>
                    </tr>
                    ${reportTable}
                </table>
            </body>

            </html>
        `;

        return html;
    }
}

class ReportGeneratorComercio {
    constructor(data) {
        this.data = data[0]; // Tomamos el primer objeto del array de datos
    }

    generateHTMLComercio() {
        let html = `
        <!DOCTYPE html>
        <html>

        <head>
            <title>Reporte para comercios - Online</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                h1 {
                    text-align: center;
                }
            </style>
        </head>

        <body>
            <h1>Reporte para comercios - Online</h1>
            <table>
                <tr>
                    <th>Total Mesas Cerradas</th>
                    <th>Total Ganancia</th>
                    <th>Total Mesas Abiertas</th>
                    <th>Total Pendiente Cobro</th>
                    <th>Total</th>
                    <th>Mejor Cliente</th>
                    <th>Mesas</th>
                    <th>Productos</th>
                    <th>Métodos de Pago</th>
                </tr>
                <tr>
                    <td>${this.data.total_mesas_cerradas}</td>
                    <td>${this.formatCurrency(this.data.total_ganancia)} PYG</td>
                    <td>${this.data.total_mesas_abiertas}</td>
                    <td>${this.formatCurrency(this.data.total_pendiente_cobro)} PYG</td>
                    <td>${this.formatCurrency(this.data.total)} PYG</td>
                    <td>${this.data.mejor_cliente}</td>
                    <td>${this.formatObjects(this.data.mesas)}</td>
                    <td>${this.formatProducts(this.data.productos)}</td>
                    <td>${this.formatMethods(this.data.metodos_pago)}</td>
                </tr>
            </table>
        </body>

        </html>
        `;
        return html;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(amount);
    }

    formatObjects(objectsString) {
        let objectsArray = JSON.parse(objectsString);
        let formatted = objectsArray.map(object => {
            return Object.entries(object)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }

    formatProducts(productsString) {
        let productsArray = JSON.parse(productsString);
        let formatted = productsArray.map(product => {
            return Object.entries(product)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }

    formatMethods(methodsString) {
        let methodsArray = JSON.parse(methodsString);
        let formatted = methodsArray.map(method => {
            return Object.entries(method)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }
}

class ReportGeneratorComercioRangoFecha {
    constructor(data, fecha_desde, fecha_hasta) {
        this.data = data[0]; // Tomamos el primer objeto del array de datos
        this.fecha_desde = fecha_desde;
        this.fecha_hasta = fecha_hasta;
    }

    generateHTMLComercioRangoFecha() {
        let formattedFechaDesde = this.formatDate(this.fecha_desde);
        let formattedFechaHasta = this.formatDate(this.fecha_hasta);
        let title = `Reporte para comercios - Rango de Fecha (${formattedFechaDesde} - ${formattedFechaHasta})`;

        let html = `
        <!DOCTYPE html>
        <html>

        <head>
            <title>${title}</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                h1 {
                    text-align: center;
                }
            </style>
        </head>

        <body>
            <h1>${title}</h1>
            <table>
                <tr>
                    <th>Total Mesas Cerradas</th>
                    <th>Total Ganancia</th>
                    <th>Total Mesas Abiertas</th>
                    <th>Total Pendiente Cobro</th>
                    <th>Total</th>
                    <th>Mejor Cliente</th>
                    <th>Mesas</th>
                    <th>Productos</th>
                    <th>Métodos de Pago</th>
                </tr>
                <tr>
                    <td>${this.data.total_mesas_cerradas}</td>
                    <td>${this.formatCurrency(this.data.total_ganancia)} PYG</td>
                    <td>${this.data.total_mesas_abiertas}</td>
                    <td>${this.formatCurrency(this.data.total_pendiente_cobro)} PYG</td>
                    <td>${this.formatCurrency(this.data.total)} PYG</td>
                    <td>${this.data.mejor_cliente}</td>
                    <td>${this.formatObjects(this.data.mesas)}</td>
                    <td>${this.formatProducts(this.data.productos)}</td>
                    <td>${this.formatMethods(this.data.metodos_pago)}</td>
                </tr>
            </table>
        </body>

        </html>
        `;
        return html;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(amount);
    }

    formatObjects(objectsString) {
        let objectsArray = JSON.parse(objectsString);
        let formatted = objectsArray.map(object => {
            return Object.entries(object)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }

    formatProducts(productsString) {
        let productsArray = JSON.parse(productsString);
        let formatted = productsArray.map(product => {
            return Object.entries(product)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }

    formatMethods(methodsString) {
        let methodsArray = JSON.parse(methodsString);
        let formatted = methodsArray.map(method => {
            return Object.entries(method)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
        }).join('<br><br>');
        return formatted;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PY', options);
    }
}

module.exports = ReportGeneratorUser;
module.exports = ReportGeneratorComercio;
module.exports = ReportGeneratorComercioRangoFecha;

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

    async getReporteUsuarioHTML(req, res) {
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

            const reportGenerator = new ReportGeneratorUser(data);
            const htmlReport = reportGenerator.generateHTMLReport();
            console.log(htmlReport);

            // Aquí puedes enviar el informe HTML como respuesta al cliente
            return res.status(200).send(htmlReport);     

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

    async getReporteComercioOnlineHTML(req, res) {
        const id_local = req.params.id_local;

        Reportes.getReporteComercioOnline(id_local, async (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de obtener los datos del reporte online para comercios',
                    error: err
                });
            }

            const reportGenerator = new ReportGeneratorComercio(data);
            const htmlReport = reportGenerator.generateHTMLComercio();
            console.log(htmlReport);

            // Aquí puedes enviar el informe HTML como respuesta al cliente
            return res.status(200).send(htmlReport);  

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
    },

    async getReporteComercioRangoFechaHTML(req, res) {
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

            const reportGenerator = new ReportGeneratorComercioRangoFecha(data, fecha_desde, fecha_hasta);
            const htmlReport = reportGenerator.generateHTMLComercioRangoFecha();
            console.log(htmlReport);

            // Aquí puedes enviar el informe HTML como respuesta al cliente
            return res.status(200).send(htmlReport);  
     
        });
    }
}