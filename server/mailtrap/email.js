const { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } = require("./htmlEmail");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_MAIL,     
    pass: process.env.SMTP_PASSWORD, 
  },
});

const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  var mailOptions = {
    from: "no-reply@patelfood.com",
    to: email,
    subject: 'Verify your email',
    html: htmlContent.replace("{verificationToken}", verificationToken)
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendWelcomeEmail = expressAsyncHandler(async (email, name) => {
  const html = generateWelcomeEmailHtml(name);
  var mailOptions = {
    from: "no-reply@patelfood.com",
    to: email,
    subject: 'Welcome to PatelEats',
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendPasswordResetEmail = expressAsyncHandler(async (email, resetURL) => {
  const html = generatePasswordResetEmailHtml(resetURL);
  var mailOptions = {
    from: "no-reply@patelfood.com",
    to: email,
    subject: 'Reset your password',
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to reset password: " + error.message);
  }
});

const sendResetSuccessEmail = expressAsyncHandler(async (email) => {
  const html = generateResetSuccessEmailHtml();
  var mailOptions = {
    from: "no-reply@patelfood.com",
    to: email,
    subject: 'Password Reset Successfully',
    html: html,
    category: "Password Reset"
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset success email: " + error.message);
  }
});

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
};
