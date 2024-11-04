require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

const secret = process.env.TOKEN_KEY;

exports.authenticateToken = (req, res, next) => {
    const authHeader = req?.headers?.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
    console.log("Token: ",token);
    if (!token) return res?.sendStatus(401);
    jwt.verify(token, secret, async (err, decoded) => {
        console.log({err, decoded});
        if (err) return res.sendStatus(403);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.sendStatus(404);
        req.user = user;
        next();
    });
}

