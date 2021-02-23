const nodemailer=require('nodemailer');

const sendEmail=async options=>{
// 1 create a transporter

const transporter= nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.email_username,
        pass:process.env.email_password
    }
});
// 2 define email options

const mailOptions={
    from:'Ashish Rathore <testing@nodemailer>',
    to:options.email,
    Subject:options.subject,
    text:options.message
    

};
// 3 send email with email
  await transporter.sendMail(mailOptions)
}

module.exports=sendEmail;