const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accessToken: String,
  name: String,
  email: String,
  profileUrl: String,
  googleRefreshToken: { type: String, required: false },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true } );



module.exports = mongoose.model("Users", userSchema);