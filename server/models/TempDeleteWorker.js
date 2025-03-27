const mongoose = require("mongoose");

const tempDeleteWorkerSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ✅ Worker ID stored here
    verificationToken: { type: String, required: true },
    verificationTokenExpiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("TempDeleteWorker", tempDeleteWorkerSchema);
