const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      console.log("error: ", err);
      return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      console.log("user: ", user);
      if (user) return res.json({ status: true, user: user.username })
      else {
        console.log("user not found");
        return res.json({ status: false })
      }
    }
  })
}