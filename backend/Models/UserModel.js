const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accessToken: String,
  name: String,
  email: String,
  profileUrl: String,
});


module.exports = mongoose.model("Users", userSchema);