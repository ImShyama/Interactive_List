const User = require("../Models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "CBXTREEIL";


module.exports.FetchData = async (req, res) => {
  const { accessToken, name, email, profileUrl } = req.body;

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    let updatedUser = await User.findOneAndUpdate(
      { email },
      {
        accessToken: accessToken,
        // googleRefreshTokenExpiry: tokens.expiry_date,
        // role: "ADMIN"
      }
    );
    console.log(updatedUser);
    const token = jwt.sign({ userId: existingUser._id }, secret);
    // delete existingUser.accessToken;
    // delete existingUser.OTP;
    return res.send({
      body: existingUser,
      token,
    });
  } else {
    // Save user to MongoDB
    const newUser = await User.create({ accessToken, name, email, profileUrl });
    const token = jwt.sign({ userId: newUser._id }, secret);
    // delete newUser.password;
    // delete newUser.googleRefreshToken;
    // delete newUser.OTP;
    return res.send({
      body: newUser,
      token,
    });

    // Send token as a cookie
    // res.cookie("token", token, { httpOnly: true });
    // res.status(200).json({ message: "User authenticated and saved" });
  }
};
