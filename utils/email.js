const nodemailer = require('nodemailer');
const config = require('../configuration/config');

const emailSending = async (user, subject, message) => {
    const mailOptions = {
        from: 'Admin',
        to: user,
        subject,
        html: message
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: config.oauth
    });

    await transporter.sendMail(mailOptions, (err, resp) => {
        if (err) {
            console.log(err);
        } else {
            console.log(resp);
        }
    });
};

module.exports = emailSending;
