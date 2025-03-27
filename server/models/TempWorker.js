const mongoose = require("mongoose");

const TempWorkerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        WorkersName: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        contactNo: {
            type: String,
            required: true,
        },
        OriginalWorkerId: {
            type: String,
            required: false, // Optional field
        },
        Occupations: [{ type: String, required: true }],
        explores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Explore" }],
        imageUrl: {
            type: String,
            required: true,
        },
        verificationToken: { type: String, required: true },
        verificationTokenExpiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// ✅ Prevent Overwrite Issue
const TempWorker = mongoose.models.TempWorker || mongoose.model("TempWorker", TempWorkerSchema);

module.exports = TempWorker;
