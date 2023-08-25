const nodemailer = require('nodemailer');

enviarMail = async ()=> {
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
        to      : 'ricardojaviergonzalezbraga@gmail.com',
        subject : 'Correo de pruebas',
        text    : 'Envio de correo app gastro'
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    console.log(info);
}

enviarMail();