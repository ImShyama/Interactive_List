const mongoose = require("mongoose");
const { Schema } = mongoose;

const featuresSchema = new Schema({
  featureName: { type: String, required: true },
  month: { type: String, required: true },
  videoUrl: { type: String },
  imgUrl: { type: String },
}, { timestamps: true });
const FeaturesUpdate = mongoose.model("featuresUpdates", featuresSchema);

module.exports = FeaturesUpdate;