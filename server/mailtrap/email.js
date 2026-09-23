const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} = require("./htmlEmail");

dotenv.config();

// Create the transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  const mailOptions = {
    from: `"PatelEats" <${process.env.SMTP_MAIL}>`,
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
  const mailOptions = {
    from: `"PatelEats" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: "Welcome to PatelEats",
    html: generateWelcomeEmailHtml(name),
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
  const mailOptions = {
    from: `"PatelEats" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: "Reset your password",
    html: generatePasswordResetEmailHtml(resetURL),
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
  const mailOptions = {
    from: `"PatelEats" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: "Password Reset Successfully",
    html: generateResetSuccessEmailHtml(),
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
