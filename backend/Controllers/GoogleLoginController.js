const UsersModel = require("../Models/UserModel.js")
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const nodemailer = require("nodemailer");

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const { createSecretToken } = require("../utils/SecretToken.js");

const RegisterEmailTemplate = ({ name, email }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const currentYear = new Date().getFullYear(); // ✅ extract year
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Interact Tools</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles for email clients */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Hover effects for supported email clients */
    @media screen {
      .info-card:hover {
        background-color: #f8f9fa !important;
        border-color: #578737 !important;
      }
      
      .feature-chip:hover {
        background-color: #578737 !important;
        color: #ffffff !important;
      }
      
      
       .btn-primary:hover {
        background-color: #456b2c !important;
        background: #456b2c !important;
      }
    }
    
    /* Mobile responsiveness */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .mobile-padding {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      
      .info-card-container {
        width: 100% !important;
        display: block !important;
        margin-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f7fa; line-height:1.5;">

  <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:15px 0;">
    <tr>
      <td align="center">
        <!-- Email Container -->
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:480px; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#578737; background-image: linear-gradient(135deg, #578737 0%, #56a322 50%, #56a322 100%); padding:30px 20px; color:#ffffff;" class="mobile-padding">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="width:60px; height:60px; border-radius:50%; background-color:rgba(255,255,255,0.2); text-align:center; line-height:60px; font-size:24px; margin-bottom:12px; border: 3px solid rgba(255, 255, 255, 0.2);">🚀</div>
                    <h1 style="margin:0; font-size:22px; font-weight:bold; color:#ffffff;">Welcome to Interact Tools</h1>
                    <p style="margin:5px 0 0; font-size:14px; color:#ffffff; opacity: 0.95;">Transform your spreadsheets into powerful apps</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:25px 20px; color:#333333;" class="mobile-padding">
              
              <!-- Welcome Card -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; background-image: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border:1px solid #e9ecef; border-radius:12px; padding:20px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04); margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <p style="margin:5px 0 15px; font-size:18px; font-weight:600; color:#578737; font-family: 'Poppins', Arial, sans-serif;">${name}</p>

                    <!-- Google Sign-In -->
                    <table cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border:1px solid #dadce0; border-radius:50px; margin:0 auto;">
                      <tr>
                        <td style="padding:8px 14px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right:8px;" valign="middle">
                                <img src="https://i.ibb.co/tTbdPtzn/google.png" alt="Google" style="width:18px; height:18px; display:block;" />
                              </td>
                              <td valign="middle">
                                <span style="font-size:13px; font-weight:500; color:#444;">Signed in with Google</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info Cards -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
                <tr>
                  <td class="info-card-container" width="50%" style="padding-right:5px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="info-card" style="border:2px solid #f1f3f4; border-radius:8px; background-color:#ffffff;">
                      <tr>
                        <td style="padding:10px; position:relative;" align="center">
                          <div style="font-size:20px; margin-bottom: 10px;">📧</div>
                          <div style="font-size:11px; text-transform:uppercase; color:#666; font-weight:bold; letter-spacing: 1px; margin-bottom: 8px;">Email Address</div>
                          <div style="font-size:13px; font-weight:600; color:#578737; word-break:break-word; font-family: 'Poppins', Arial, sans-serif;"><a href="mailto:${email}" 
   style="color:#578737 !important; text-decoration:none !important; font-weight:600;">
  ${email}
</a>
</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="info-card-container" width="50%" style="padding-left:5px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="info-card" style="border:2px solid #f1f3f4; border-radius:8px; background-color:#ffffff;">
                      <tr>
                        <td style="padding:10px;" align="center">
                          <div style="font-size:20px; margin-bottom: 10px;">📅</div>
                          <div style="font-size:11px; text-transform:uppercase; color:#666; font-weight:bold; letter-spacing: 1px; margin-bottom: 8px;">Joined Today</div>
                          <div style="font-size:13px; font-weight:600; color:#578737; font-family: 'Poppins', Arial, sans-serif;">${currentDate}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Product Intro -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#e8f5e8; background-image: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%); border:1px solid #c8e6c9; border-radius:12px; padding:20px; margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <div style="width: 40px; height: 40px; background-color:#578737; background-image: linear-gradient(135deg, #578737 0%, #56a322 100%); border-radius: 50%; text-align:center; line-height:40px; color: white; font-size: 20px; margin:0 auto 15px; box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);">⚡</div>
                    
                    <div style="font-size:16px; font-weight:600; color:#578737; margin: 0 0 10px; font-family: 'Poppins', Arial, sans-serif;">Where Spreadsheets Meet Innovation</div>
                    
                  <p style="font-size:13px; color:#333; margin:0 0 15px; line-height:1.5; font-family: 'Poppins', Arial, sans-serif;">
  Transform your Google Sheets into sleek, interactive, user-friendly apps in minutes—no coding required.
</p>

                    
                     <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td align="center">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding:2px;">
                                <span class="feature-chip" style="font-size:11px; font-weight:600; color:#578737; border:2px solid #c8e6c9; background-color: white; border-radius:16px; display:inline-block; padding:5px 10px; font-family: 'Poppins', Arial, sans-serif;">Google Sheet Integration</span>
                              </td>
                              <td style="padding:2px;">
                                <span class="feature-chip" style="font-size:11px; font-weight:600; color:#578737; border:2px solid #c8e6c9; background-color: white; border-radius:16px; display:inline-block; padding:5px 10px; font-family: 'Poppins', Arial, sans-serif;">Dynamic Tables</span>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" align="center" style="padding:4px;">
                                <span class="feature-chip" style="font-size:11px; font-weight:600; color:#578737; border:2px solid #c8e6c9; background-color: white; border-radius:16px; display:inline-block; padding:5px 10px; font-family: 'Poppins', Arial, sans-serif;">Custom Layouts</span>
                              
                                <span class="feature-chip" style="font-size:11px; font-weight:600; color:#578737; border:2px solid #c8e6c9; background-color: white; border-radius:16px; display:inline-block; padding:5px 10px; font-family: 'Poppins', Arial, sans-serif;">Live Data Sync</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="text-align: center; padding: 30px 25px; background-color:#f8f9fa; background-image: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; border: 1px solid #dee2e6;">
                <tr>
                  <td align="center">
                    <h3 style="font-size:15px; font-weight:bold; margin:0 0 15px; color:#333;font-family: 'Poppins', Arial, sans-serif;">Ready to Get Started?</h3>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="border-radius:50px; background-color:#578737; background-image: linear-gradient(135deg, #578737 0%, #56a322 100%); box-shadow: 0 8px 25px rgba(87, 135, 55, 0.3);">
                          <a href="https://interact.ceoitbox.com/dashboard" class="btn-primary" style="background-color:#578737; color:#ffffff; padding:12px 32px; border-radius:50px; text-decoration:none; font-size:14px; font-weight:600; display:inline-block; border:none; font-family: 'Poppins', Arial, sans-serif;">Launch Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
         <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#578737; background-image: linear-gradient(135deg, #578737 0%, #56a322 100%); padding:20px; color:#ffffff;" class="mobile-padding">
              <p style="margin:0; font-weight:bold; color:#ffffff;font-family: 'Poppins', Arial, sans-serif;">Interact Tools</p>
              <p style="margin:5px 0 10px; font-size:13px; color:#ffffff; opacity: 0.9;font-family: 'Poppins', Arial, sans-serif;">Thank you for choosing us to transform your data experience!</p>
              
              <!-- Copyright Section -->
              <!-- Copyright Section -->
<div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 15px; margin-top: 10px;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" style="text-align:center;">
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto; white-space:nowrap;">
          <tr>
            <td style="font-size:12px; color:#ffffff; opacity:0.85; font-weight:300; line-height:1.4; white-space:nowrap;">
              © ${currentYear} All rights reserved&nbsp;|&nbsp;by&nbsp;
            </td>
            <td valign="middle" style="line-height:0; padding:0 4px;">
              <img src="https://res.cloudinary.com/df0pdiqp8/image/upload/v1759554757/logo-png-1-1_qhdr2p.png" 
                   alt="CEOITBOX Logo"
                   width="16"
                   height="16"
                   style="width:16px; height:16px; background-color:#ffffff; border-radius:3px; padding:2px; display:inline-block; vertical-align:middle; border:0;" />
            </td>
            <td valign="middle" style="padding-left:4px;">
              <a href="https://mbai.ceoitbox.tech/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 style="color:#B7EFC5; font-weight:600; text-decoration:none; font-size:12px; display:inline-block; vertical-align:middle;">
                 CEOITBOX
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>

            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;
}


exports.InitiateGoogleLogin = (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',  // This ensures that a new refresh token is issued
    scope: ['email', 'profile'
      , "https://www.googleapis.com/auth/spreadsheets"
      , "https://www.googleapis.com/auth/drive.file"
    ] // Add any additional scopes you need
  });
  res.redirect(authUrl);
}

const checkLicenseValidity = async (email, sheetID) => {
  try {
    const url = `https://auth.ceoitbox.com/checkauth/${sheetID}/${email}/${sheetID}/NA/NA`;
    const response = await axios.get(url);

    console.log({ response: response.data, valid: response.data.valid, status: response.data.status })
    if (response.data && response.data.valid === "Active" && response.data.status === "Active") {
      return response.data;
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

    const isLicenseValid = await checkLicenseValidity(userEmail, "CBXINTERACT");

    if (!isLicenseValid || isLicenseValid.valid !== "Active" || isLicenseValid.status !== "Active") return res.send({ error: "Unfortunately you are not authorised to access this app. Please connect with CEOITBOX team at access@ceoitbox.in." })

    const existingUser = await UsersModel.findOne({ email }).lean();
    console.log({ existingUser });
    if (existingUser) {
      const updateFields = {
        name: userName,
        profileUrl: payload.picture,
      };
      // Only update refresh token if Google provided a new one
      if (tokens && tokens.refresh_token) {
        updateFields.googleRefreshToken = tokens.refresh_token;
      }
      let updatedUser = await UsersModel.findOneAndUpdate(
        { email },
        updateFields,
        { new: true }
      ).lean();

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

      // 🎯 send email after signup
      // await sendEmail({
      //     to: email,
      //     subject: "Welcome to My App 🎉",
      //     text: `Hi, thanks for signing up!`,
      //     html: RegisterEmailTemplate(),
      // });

      await sendEmail({
        to: email,
        subject: "Welcome to Interact Tool 🎉",
        text: `Hi ${userName}, thanks for signing up!`,
        html: RegisterEmailTemplate({
          name: userName,
          email: userEmail
        }),
      });


      if (!newUser.isApproved) return res.send({ error: "User is not Approved. Please connect with CEOITBOX team at access@ceoitbox.in." });

      console.log({ newUser });
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

async function sendEmail(emailConfig) {
  try {
    // Create transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP server connection verified');

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: emailConfig.from || process.env.EMAIL_USER,
      to: emailConfig?.to,
      cc: emailConfig?.cc,
      bcc: emailConfig?.bcc,
      subject: emailConfig?.subject,
      text: emailConfig?.text,
      html: emailConfig?.html,
      attachments: emailConfig?.attachments
    });

    console.log('Email sent successfully:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}