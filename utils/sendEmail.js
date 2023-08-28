const nodemailer = require('nodemailer');

enviarMail = async (destinatario, htmlContent)=> {
    const config = {
        host : 'smtp.gmail.com',
        port : 587,
        auth : {
            user : 'appgastrogastro@gmail.com',
            pass : 'lkootplmagfcthoq'
        }
    }

    const mensaje = {
        from    : 'appgastrogastro@gmail.com',
        to      : destinatario,
        subject : 'Comprobante de Pago - AppGastro',
        html    : htmlContent
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    console.log(info);
}

module.exports = enviarMail;