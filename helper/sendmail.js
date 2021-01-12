var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elearningwebproject@gmail.com', //email ID
        pass: 'elearning123' //Password 
    }
});

function sendMail(email, otp) {
    var details = {
        from: 'elearningwebproject@gmail.com', // sender address same as above
        to: email, // Receiver's email id
        subject: 'Your demo OTP is ', // Subject of the mail.
        html: otp // Sending OTP 
    };


    transporter.sendMail(details, function(error, data) {
        if (error)
            console.log(error)
        else
            console.log(data);
    });
}

module.exports = sendMail