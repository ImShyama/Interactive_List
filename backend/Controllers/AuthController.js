const User = require("../Models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "CBXTREEIL";


module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      // httpOnly: false,
      maxAge: 1000*60*60*60*24*5,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      // httpOnly: false,
      maxAge: 1000*60*60*60*24*5,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.GoogleSignin = async (req, res) => {
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
    console.log(newUser);
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
