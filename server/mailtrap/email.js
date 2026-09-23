const { MailtrapClient } = require("mailtrap");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} = require("./htmlEmail");

dotenv.config();

const client = new MailtrapClient({
  token: process.env.SMTP_PASSWORD, // your Mailtrap API token
});

const sender = {
  email: process.env.SMTP_MAIL, // e.g. hello@demomailtrap.co
  name: "PatelEats",
};

const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: "Verify your email",
      html: htmlContent.replace("{verificationToken}", verificationToken),
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendWelcomeEmail = expressAsyncHandler(async (email, name) => {
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: "Welcome to PatelEats",
      html: generateWelcomeEmailHtml(name),
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});

const sendPasswordResetEmail = expressAsyncHandler(async (email, resetURL) => {
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: "Reset your password",
      html: generatePasswordResetEmailHtml(resetURL),
    });
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to reset password: " + error.message);
  }
});

const sendResetSuccessEmail = expressAsyncHandler(async (email) => {
  try {
    await client.send({
      from: sender,
      to: [{ email }],
      subject: "Password Reset Successfully",
      html: generateResetSuccessEmailHtml(),
    });
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
