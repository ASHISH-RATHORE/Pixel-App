const { Resend } = require("resend");
const resend = new Resend("re_ZjEDcRav_CZ9qw4ZM2L29deyswv6mF4VB");

exports.sendWelcomeEmail = async (options) => {
  // 1 create a transporter
  try {
    const data = await resend.emails.send({
      from: "Pixahub <no-reply@pixahub.store>",
      to: options.email,
      subject: `Welcome to Pixahub ${options.name} - Your Creative Hub for Images!`,
      html: `Welcome to Pixahub!
             
             We're thrilled to have you on board as a member of our creative community. At Pixahub, you'll find a platform where you can share, showcase, and explore a world of captivating images and creative works. Whether you're a seasoned artist, a passionate photographer, or someone who simply loves visual inspiration, Pixahub is here to provide a space for your creativity to shine.`,
    });
    return true;
  } catch (error) {
    return false;
    console.error(error, "error while email sending");
  }
};

// export const sendPasswordReset = async (options) => {
//   // 1 create a transporter
//   try {
//     const data = await resend.emails.send({
//       from: "Pixahub <no-reply@pixahub.store>",
//       to: options.email,
//       subject: options.subject,
//       html: options.message,
//     });

//     console.log(data);
//   } catch (error) {
//     console.error(error, "error while email sending");
//   }
// };
