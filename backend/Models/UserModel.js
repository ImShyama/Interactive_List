const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accessToken: String,
  name: String,
  email: String,
  profileUrl: String,
  googleRefreshToken: { type: String, required: true }
});


module.exports = mongoose.model("Users", userSchema);