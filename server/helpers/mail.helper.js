import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'apniwebapp@gmail.com', // Your Gmail address
        pass: 'qjqn seiq xbts bbsf', // Your Gmail password or app-specific password
    },
    tls:{
        rejectUnauthorized: false
    }
});

async function sendMail(subject, receiver, text, html) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: receiver,
        subject,
        text,
        html
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Mail to email:', receiver);
        return true;
    } catch (error) {
        console.error('Error sending Mail', error);
        return false;
    }
}

export default sendMail;