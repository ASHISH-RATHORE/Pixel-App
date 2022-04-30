const nodemailer=require('nodemailer');

const sendEmail=async options=>{
// 1 create a transporter

const transporter= nodemailer.createTransport({
    
    service:'Gmail',
    host:"smtp.gmail.com",
    auth:{
        user:process.env.GMAILUSERNAME, 
        pass:process.env.GMAILPASSWORD
    }
});
// 2 define email options
const mailOptions={
    from:`Pixel-Support`,
    to:options.email,
    subject:options.subject,
    text:options.message,
};
// 3 send email with email
 await transporter.sendMail(mailOptions)

 
}

module.exports=sendEmail;