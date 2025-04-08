const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const {SENDGRID_API_KEY} = process.env;

const techDetails  = {
    host: 'smtp.sendgrid.net',
    post: 465,
    secure: true,
    auth:{
        user:'apikey',
        pass: ''+ SENDGRID_API_KEY
    }
}

const transporter = nodemailer.createTransport(techDetails);
const otpTemplate = '' + fs.readFileSync(path.join(__dirname,'../email','otp.html'));
let finalOTPTemplate = '';

const sendEmailHelper = async(otp, userName, to) =>{ 
    try{
         finalOTPTemplate  = otpTemplate.replace('#(USER_NAME)', userName).replace('#(OTP)', otp);
         const text = `Hi, ${userName} , your OTP for forget password is ${otp}`;
         const emailObj ={
            to: to,
            from: 'sadhana.v1989@gmail.com', 
            subject: 'RESET PASSWORD OTP Verification',
            text: text,
            html: finalOTPTemplate,
        }
        transporter.sendMail(emailObj).then(()=>{
            console.log("email sent")
        }).catch((err)=>{
          console.log(err.message);
        });
    } catch(err){
        console.log(err.message);
    }
}

// sendEmailHelper('123456','sadhana','sadhanacanadavisa@gmail.com');

module.exports = sendEmailHelper;


