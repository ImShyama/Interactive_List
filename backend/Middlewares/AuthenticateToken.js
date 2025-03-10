require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const { checkLicenseValidity } = require("../Controllers/GoogleLoginController");


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

            if(!user.isApproved) return res.send({ error: "User is not Approved. Please connect with CEOITBOX team at access@ceoitbox.in." });

            // const isLicenseValid = await checkLicenseValidity(user.email, "CBXINTERACT");
            // if (!isLicenseValid) return res.send({ error: "Unfortunately you are not authorised to access this app. Please connect with CEOITBOX team at access@ceoitbox.in." })


            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.authenticateTokenPrivate = async (req, res, next) => {
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
                return res.status(403).json({ error: "Invalid token. Access denied.", accessType: "private" });
            }

            // Fetch the user based on the decoded ID
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ error: "User not found. Access denied." });
            }

            if(!user.isApproved) return res.send({ error: "User is not Approved. Please connect with CEOITBOX team at access@ceoitbox.in." });

            // const isLicenseValid = await checkLicenseValidity(user.email, "CBXINTERACT");
            // if (!isLicenseValid) return res.send({ error: "Unfortunately you are not authorised to access this app. Please connect with CEOITBOX team at access@ceoitbox.in." })


            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.authenticateTokenAndReturnUser = (req, res, next) => {
    const authHeader = req?.headers?.authorization;
    // console.log(authHeader);
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        req.login = false;
        return next();
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            req.login = false;
            return next();
        }
        const user = await UsersModel.findById(decoded.userId);
        if (!user) {
            req.login = false;
            return next();
        }
        req.user = JSON.parse(JSON.stringify(user));
        req.login = true;
        next();
    });
}