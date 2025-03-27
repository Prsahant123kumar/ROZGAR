const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    verificationToken: { type: String, required: true },
    verificationTokenExpiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("TempUser", tempUserSchema);
