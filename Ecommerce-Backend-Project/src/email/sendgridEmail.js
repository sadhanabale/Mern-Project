const dotenv = require("dotenv");
// const sgMail = require('@sendgrid/mail'); // used for sendgrid email
const nodemailer = require('nodemailer');
dotenv.config();

const {SENDGRID_API_KEY} = process.env;

const techDetails ={

    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth:{
        user:"apikey",
        pass: SENDGRID_API_KEY
       
    }
}

const transporter = nodemailer.createTransport(techDetails);

const emailObject = {
  to: 'sadhanacanadavisa@gmail.com', 
  from: 'sadhana.v1989@gmail.com',
  subject: 'Sending with NodeMailer is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>nodemailer is sending an email</strong>',
}

transporter.sendMail(emailObject).then(()=>{
    console.log("Email sent");
}).catch((err)=>{
    console.log(err.message);
});