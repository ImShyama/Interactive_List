const UsersModel = require("../Models/UserModel.js")
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;



const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const { createSecretToken } = require("../utils/SecretToken.js");

exports.InitiateGoogleLogin = (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',  // This ensures that a new refresh token is issued
        scope: ['email', 'profile'
            , "https://www.googleapis.com/auth/spreadsheets"
            , "https://www.googleapis.com/auth/drive"
        ] // Add any additional scopes you need
    });
    res.redirect(authUrl);
}

const checkLicenseValidity = async (email, sheetID) => {
    try {
        const url = `https://auth.ceoitbox.com/checkauth/${sheetID}/${email}/${sheetID}/NA/NA`;
        const response = await axios.get(url);

        if (response.data && response.data.valid === "Active" && response.data.status === "Active") {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking license validity:", error.message);
        return false;
    }
}

exports.HandleGoogleLogin = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await client.getToken(code);
        // Use tokens.access_token for accessing Google APIs on behalf of the user
        const { email } = await client.getTokenInfo(tokens.access_token);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: CLIENT_ID, // Specify your app's client ID
        });
        const payload = ticket.getPayload();
        console.log({ payload });
        const userEmail = payload.email;
        const userName = payload.name;

        // const isLicenseValid = await checkLicenseValidity(userEmail, "CBXINTERACT");
        // if (!isLicenseValid) return res.send({ error: "Unfortunately you are not authorised to access this app. Please connect with CEOITBOX team at access@ceoitbox.in."        })

        const existingUser = await UsersModel.findOne({ email }).lean();
        console.log({existingUser});
        if (existingUser) {
            let updatedUser = await UsersModel.findOneAndUpdate({ email }, {
                name: userName,
                profileUrl: payload.picture,
                googleRefreshToken: tokens.refresh_token,
            }).lean();

            if (!updatedUser.isApproved) return res.send({ error: "User is not Approved. Please connect with CEOITBOX team at access@ceoitbox.in." });

            const token = createSecretToken(existingUser._id);
            delete existingUser.password;
            delete existingUser.googleRefreshToken;
            delete existingUser.OTP;
            return res.send({
                body: existingUser,
                token
            })
        }
        else {
            let newUser = await UsersModel.create({
                name: userName,
                email,
                profileUrl: payload.picture,
                googleRefreshToken: tokens.refresh_token,
                role: "user",
            })
            newUser = JSON.parse(JSON.stringify(newUser))

            if (!newUser.isApproved) return res.send({ error: "User is not Approved. Please connect with CEOITBOX team at access@ceoitbox.in." });

            console.log({newUser});
            const token = createSecretToken(newUser._id);
            delete newUser.password;
            delete newUser.googleRefreshToken;
            delete newUser.OTP;
            return res.send({
                body: newUser,
                token
            })
        }
    } catch (error) {
        console.error('Error retrieving access token:', error.message);
        res.status(500).send('Error retrieving access token');
    }
}

exports.checkLicenseValidity = checkLicenseValidity