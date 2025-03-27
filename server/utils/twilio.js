require("dotenv").config();
const twilio = require("twilio");

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Function to send OTP via SMS
const sendOTP = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log("✅ OTP Sent:", message.sid);
        return { success: true, message: "OTP sent successfully" };
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        return { success: false, message: "Failed to send OTP", error };
    }
};

module.exports = { generateOTP, sendOTP };
