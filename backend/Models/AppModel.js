const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
    unique: true
  },
  appView: {
    type: String,
    required: true
  },
  appImg: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  appID: {
    type: String,
    required: true
  },
  spreadSheetName: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  multipleImage: [String],
  allowedGroups: {
    type: [String],
    default: []
  },
  show: {
    type: Boolean,
    default: true
  },
  standOut: [{
    type: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

module.exports = mongoose.model("Apps", appSchema);
