const nodemailer = require('nodemailer');

async function enviarMail(destinatario, htmlContent) {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'appgastrogastro@gmail.com',
      pass: 'circ ayse npfj urdi'
    }
  }

  const mensaje = {
    from: 'appgastrogastro@gmail.com',
    to: destinatario,
    subject: 'Comprobante de Pago - AppGastro',
    html: htmlContent
  }

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje);

  console.log(info);
}

module.exports = enviarMail;
