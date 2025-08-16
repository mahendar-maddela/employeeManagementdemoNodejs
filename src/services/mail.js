const nodemailer = require('nodemailer');

const sendPasswordCreationEmail = async (email, dummyPassword) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mahendar@spackdigi.com',
            pass: 'zkpx pyak ucvz ecnn', 
        },
    });

    const mailOptions = {
        from: 'mahendar@spackdigi.com',
        to: email,
        subject: 'Create Your Password',
        text: `Welcome! Please login using the temporary password below and change it after logging in:\n\n
        Email: ${email}
        Temporary Password: ${dummyPassword}
        If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordCreationEmail };
;