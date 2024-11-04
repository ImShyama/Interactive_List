const UsersModel = require("../Models/UserModel.js")

const { OAuth2Client } = require("google-auth-library");

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
        const userEmail = payload.email;
        const userName = payload.name;
        // let { data: slmRes } = await axios.get(`https://auth.ceoitbox.com/checkauth/CBXSHEETOWA/${email}/dwf/NA/NA`);
        // if (slmRes.valid != "Active") return res.send({ error: "Unfortunately you are not authorised to access this app. Please connect with CEOITBOX team at access@ceoitbox.in." })

        const existingUser = await UsersModel.findOne({ email }).lean();
        if (existingUser) {
            let updatedUser = await UsersModel.findOneAndUpdate({ email }, {
                googleRefreshToken: tokens.refresh_token,
            }).lean();

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
                name: userEmail,
                email,
                googleRefreshToken: tokens.refresh_token,
            })
            newUser = JSON.parse(JSON.stringify(newUser))

            const token = createSecretToken(existingUser._id);
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