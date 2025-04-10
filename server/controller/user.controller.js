const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary");
const { generateVerificationCode } = require("../utils/generateVerificationCode");
const  generateToken  = require("../utils/generateToken");
const { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } = require("../mailtrap/email");
const TempUser = require("../models/TempUser");

const signup = async (req, res) => {
    try {
        const { fullname, email, password, contact } = req.body;

        // Validate required fields
        if (!fullname || !email || !password || !contact) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        await TempUser.deleteOne({ email });
        // Generate OTP & Expiry
        const verificationToken = generateVerificationCode(); // e.g., 6-digit code
        const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiry

        // Store user details temporarily in Redis
        await TempUser.create({
            fullname,
            email,
            password: hashedPassword,
            contact,
            verificationToken,
            verificationTokenExpiresAt
        });

        // Send OTP Email
        try {
            await sendVerificationEmail(email, verificationToken);
            return res.status(200).json({
                success: true,
                message: "Verification email sent. Please check your inbox."
            });
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email"
            });
        }

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        // Send user details without the password
        const userWithoutPassword = await User.findOne({ email }).select("-password");

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { verificationCode } = req.body;

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: "Verification code is required." });
        }

        // Find user with valid OTP in TempUser
        const tempUser = await TempUser.findOne({ 
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() } // Ensure OTP is not expired
        });

        if (!tempUser) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token." });
        }

        // Save user to the main User collection
        const newUser = await User.create({
            fullname: tempUser.fullname,
            email: tempUser.email,
            password: tempUser.password,
            contact: tempUser.contact,
            isVerified: true
        });

        // Delete the TempUser entry (Cleanup)
        await TempUser.deleteOne({ email: tempUser.email });

        // Send Welcome Email
        await sendWelcomeEmail(newUser.email, newUser.fullname);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                contact: newUser.contact,
                isVerified: newUser.isVerified
            }
        });

    } catch (error) {
        console.error("Verify Email Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const logout = async (_, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password`);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { id: email, password: newPassword } = req.body.take; // Extract email and new password
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword; // Assuming the password is hashed elsewhere
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;
        let cloudResponse;
        if (profilePicture) {
            cloudResponse = await cloudinary.uploader.upload(profilePicture);
        } 
        console.log(req.id,req._id,req.body);
        const updatedData = {fullname, email, address, city, country, profilePicture};

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup, login, verifyEmail, logout, forgotPassword, resetPassword, checkAuth, updateProfile };
