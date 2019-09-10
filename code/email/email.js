const nodemailer = require('nodemailer'); // include the nodemailer module


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'magento.ttv@gmail.com',
        pass: '254938342'
    }
});

var mailOptions = {
    from: 'magento.ttv@gmail.com',
    to: 'maivanthu.cs@gmail.com',
    subject: 'Sending email using Nodejs',
    text: 'Hello, Nice to talk you!'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
