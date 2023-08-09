const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFGenerator {
    constructor(data) {
        this.data = data;
        this.doc = new PDFDocument();
    }

    generatePDF(outputFilePath) {
        // Crear un archivo de salida para el PDF
        const outputStream = fs.createWriteStream(outputFilePath);

        // Encabezado del PDF
        this.doc.fontSize(20).text('Reporte de Pagos', { align: 'center' });

        // Agregar datos al PDF
        this.data.forEach(entry => {
            this.doc.text(`Mesero: ${entry.Mesero}`);
            this.doc.text(`Fecha: ${entry.fechaPago}`);
            this.doc.text(`Monto Pagado: ${entry.montoPagado}`);
            this.doc.moveDown(); // Moverse a la siguiente línea
        });

        // Finalizar y guardar el PDF
        this.doc.pipe(outputStream);
        this.doc.end();

        // Manejar evento cuando se termine de escribir el PDF
        outputStream.on('finish', () => {
            console.log(`PDF generado en ${outputFilePath}`);
        });

        // Manejar errores
        outputStream.on('error', (error) => {
            console.error('Error al generar el PDF:', error);
        });
    }
}

module.exports = PDFGenerator;
