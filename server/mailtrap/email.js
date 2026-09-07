const { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } = require("./htmlEmail");
const { client, sender } = require("./mailtrap");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

// Send Verification Email
const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: 'Verify your email',
      html: htmlContent.replace("{verificationToken}", verificationToken)
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

// Send Welcome Email
const sendWelcomeEmail = expressAsyncHandler(async (email, name) => {
  const html = generateWelcomeEmailHtml(name);
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: 'Welcome to PatelEats',
      html: html,
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

// Send Password Reset Email
const sendPasswordResetEmail = expressAsyncHandler(async (email, resetURL) => {
  const html = generatePasswordResetEmailHtml(resetURL);
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: 'Reset your password',
      html: html
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to reset password: " + error.message);
  }
});

// Send Reset Success Email
const sendResetSuccessEmail = expressAsyncHandler(async (email) => {
  const html = generateResetSuccessEmailHtml();
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: 'Password Reset Successfully',
      html: html,
      category: "Password Reset"
    });
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
