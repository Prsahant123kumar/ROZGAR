const mongoose = require("mongoose");

const ExploreSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

const Explore = mongoose.models.Explore || mongoose.model("Explore", ExploreSchema);

module.exports = Explore;
