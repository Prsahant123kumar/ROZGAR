const { 
  generatePasswordResetEmailHtml, 
  generateResetSuccessEmailHtml, 
  generateWelcomeEmailHtml, 
  htmlContent 
} = require("./htmlEmail");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Verify your email",
    html: htmlContent.replace("{verificationToken}", verificationToken),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendWelcomeEmail = expressAsyncHandler(async (email, name) => {
  const html = generateWelcomeEmailHtml(name);
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Welcome to PatelEats",
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendPasswordResetEmail = expressAsyncHandler(async (email, resetURL) => {
  const html = generatePasswordResetEmailHtml(resetURL);
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Reset your password",
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to reset password: " + error.message);
  }
});

const sendResetSuccessEmail = expressAsyncHandler(async (email) => {
  const html = generateResetSuccessEmailHtml();
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Password Reset Successfully",
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending reset success email:", error);
    throw new Error("Failed to send password reset success email: " + error.message);
  }
});

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
