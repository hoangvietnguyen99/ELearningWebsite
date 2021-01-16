const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elearningwebproject@gmail.com', //email ID
        pass: 'elearning123' //Password
    }
});

function sendMail(email, contents) {
    let details = {
        from: 'elearningwebproject@gmail.com', // sender address same as above
        to: email, // Receiver's email id
        subject: 'Your OTP is ', // Subject of the mail.
        html: contents // Sending OTP
    };


    transporter.sendMail(details, function(error, data) {
        if (error)
            console.log(error);
        else
            console.log(data);
    });
}

module.exports = sendMail
