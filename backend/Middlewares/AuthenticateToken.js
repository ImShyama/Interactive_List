// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const UserModel = require("../Models/UserModel");

// const secret = process.env.TOKEN_KEY;

// exports.authenticateToken = (req, res, next) => {
//     const authHeader = req?.headers?.authorization;
//     const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
//     console.log("Token123: ",token);
//     if (!token) return res?.sendStatus(401);
//     jwt.verify(token, secret, async (err, decoded) => {
//         console.log({err, decoded});
//         if (err) return res.sendStatus(403);
//         const user = await UserModel.findById(decoded.id);
//         if (!user) return res.sendStatus(404);
//         req.user = user;
//         next();
//     });
// }

require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

const secret = process.env.TOKEN_KEY;

exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;
        const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
        console.log("Token123: ", token);
        
        if (!token) {
            return res.status(401).json({ error: "No token provided. Access denied." });
        }

        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                
                // Handle token expiration specifically
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ error: "Token expired. Please log in again." });
                }

                // Handle other JWT errors
                return res.status(403).json({ error: "Invalid token. Access denied." });
            }

            // Fetch the user based on the decoded ID
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ error: "User not found. Access denied." });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
