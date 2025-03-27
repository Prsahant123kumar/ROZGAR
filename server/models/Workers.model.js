const mongoose = require("mongoose");
const Explore = require("./Explore");  // ✅ Import Explore schema

const WorkersSchema = new mongoose.Schema(
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
            required: false, // Make it optional if it's not always needed
        },
        Occupations: [{ type: String, required: true }],
        explores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Explore" }],
        imageUrl: {
            type: String,
            required: true,
        },
        verificationToken: { type: String, required: false }, // Optional if not always needed
        verificationTokenExpiresAt: { type: Date, required: false },
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                fullname: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

// ✅ Prevent Model Overwrite Issue
const Workers = mongoose.models.Workers || mongoose.model("Workers", WorkersSchema);

module.exports = Workers;
