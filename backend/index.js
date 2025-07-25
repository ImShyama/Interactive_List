const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;
const bodyParser = require("body-parser");
const { authenticateToken, authenticateTokenPrivate } = require("./Middlewares/AuthenticateToken");
const { google } = require("googleapis");
const Sheet = require("./Models/SheetModel.js");
const User = require("./Models/UserModel.js");
const fetchuser = require("./Middlewares/FetchUser.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("./Models/UserModel");
const path = require("path");
const secret = process.env.TOKEN_KEY;
const redirect_uri = process.env.REDIRECT_URI;
const NodeCache = require("node-cache");
const sheetCache = new NodeCache({ stdTTL: 60 }); // 60 sec TTL

// Add these imports at the top of the file
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: [redirect_uri],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.json());

// Serve static files from the frontend's "dist" directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Add this after your other middleware setup but before your routes
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Interactive Tools API',
      version: '1.0.0',
      description: 'API documentation for Google Sheets integration with Interactive Tools',
      contact: {
        name: 'API Support',
        email: 'shyamanand@ceoitbox.in'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./index.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", authRoute);

// Function to conditionally apply authentication
const dynamicAuth = async (req, res, next) => {
  try {
    const { sheetID } = req.body;
    if (!sheetID) return res.status(400).json({ error: "Sheet ID is required." });

    // Fetch sheet settings from DB
    const sheetDetails = await Sheet.findById(sheetID).lean();
    if (!sheetDetails) return res.status(404).json({ error: "Sheet not found." });

    const authHeader = req?.headers?.authorization;
    const token = req?.cookies?.token || (authHeader && authHeader?.split(' ')[1]);
    console.log({ token, access: sheetDetails?.accessType?.type });

    // Check if the sheet is public or private
    if (sheetDetails?.accessType?.type !== "private" && token == "null") {
      console.log("Skipping authentication for public sheet");
      return next(); // Skip authentication for public sheets
    }

    authenticateTokenPrivate(req, res, next); // Apply authentication for private sheets
  } catch (error) {
    console.error("Authentication check error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// app.use(authenticateToken);

async function getMetaSheetData({ sheets, spreadSheetID, range }) {
  const formulaResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetID,
    range: `${range}!1:2`,
    valueRenderOption: "FORMULA", // Ensures formulas are returned
  });
  const formulaHeader = formulaResponse.data.values[0];

  const normalResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetID,
    range: `${range}!1:1`,
  });

  const normalHeader = normalResponse.data.values[0];

  const checkRow1 = formulaHeader?.find((item) => {
    return String(item || "").toLowerCase().includes("=query") || String(item || "").toLowerCase().includes("=importrange")
      || String(item || "").toLowerCase().includes("=filter");
  });

  const checkRow2 = formulaResponse?.data?.values[1]?.find((item) => {
    return String(item || "").toLowerCase().includes("=query") || String(item || "").toLowerCase().includes("=importrange")
      || String(item || "").toLowerCase().includes("=filter");
  });

  const disableEditing = checkRow1 || checkRow2;

  let obj = {};

  for (let i = 0; i < formulaHeader.length; i++) {
    let fHeader = formulaHeader[i];
    let nHeader = normalHeader[i].replace(/\s+/g, '_').toLowerCase();
    obj[nHeader] = !(disableEditing || String(fHeader || "").toLowerCase().includes("=arrayformula"));
  }

  return obj;
}

// Example of documenting a route (add this before the route definition)
/**
 * @swagger
 * /getSheetDataWithID:
 *   post:
 *     summary: Get sheet data by ID
 *     tags: [Sheets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sheetID
 *             properties:
 *               sheetID:
 *                 type: string
 *                 description: ID of the sheet to fetch
 *     responses:
 *       200:
 *         description: Sheet data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: array
 *                 permissions:
 *                   type: string
 *                 jsonData:
 *                   type: array
 *                 hiddenCol:
 *                   type: array
 *                 formulaData:
 *                   type: object
 *                 settings:
 *                   type: object
 *                 user:
 *                   type: object
 *       404:
 *         description: Sheet not found
 *       500:
 *         description: Server error
 */
app.post("/getSheetDataWithID", dynamicAuth, async (req, res) => {
  const startTime = Date.now();
  const log = (label) =>
    console.log(label, `[+${((Date.now() - startTime) / 1000).toFixed(2)}s]`);

  log("115");

  try {
    const { sheetID } = req.body;
    const sheetDetails = await Sheet.findById(sheetID).lean();
    if (!sheetDetails) return res.status(404).json({ error: "Sheet not found." });

    const spreadSheetID = sheetDetails.spreadsheetId;
    const fullRange = sheetDetails.firstTabDataRange; // Use DB range directly
    const sheetName = fullRange.split("!")[0];
    const sheetOwner = await User.findById(sheetDetails.userId).lean();

    const cacheKey = `sheet-${sheetID}`;
    const cached = sheetCache.get(cacheKey);

    let allRows;
    let authClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    authClient.setCredentials({ refresh_token: sheetOwner.googleRefreshToken });

    const sheets = google.sheets({ version: "v4", auth: authClient });

    if (cached?.rows?.length) {
      log("from-cache");
      allRows = cached.rows;
    } else {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetID,
        range: fullRange, // fetch full dynamic range
      });

      log("171");

      allRows = response.data.values;
      if (!allRows || allRows.length === 0)
        return res.status(404).json({ error: "No data found." });

      sheetCache.set(cacheKey, { rows: allRows }); // store in cache
    }

    log("178");

    const hiddenCol = sheetDetails.hiddenCol || [];
    const jsonData = convertArrayToJSON(allRows, hiddenCol);

    log("181");

    const formulaData = await getMetaSheetData({
      sheets,
      spreadSheetID,
      range: sheetName,
    });

    log("186");

    const tempAccess = sheetDetails.sharedWith?.find(
      (entry) => entry?.email === req?.user?.email
    );
    let permissions = tempAccess?.permission;

    if (sheetDetails?.accessType?.type === "public" && !permissions) {
      permissions = "view";
    }

    return res.status(200).json({
      rows: allRows, // ✅ full rows, not paginated
      permissions,
      jsonData,
      hiddenCol,
      formulaData,
      settings: sheetDetails,
      user: req.user,
      totalRows: allRows.length,
    });
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /getUserData:
 *   get:
 *     summary: Get authenticated user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
app.get("/getUserData", authenticateToken, (req, res) => {
  res.send(req.user);
});

/**
 * @swagger
 * /getallusers:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   appsCount:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get("/getallusers", authenticateToken, async (req, res) => {
  console.log("API Hit: /getallusers");
  try {
    // Fetch all users
    const users = await User.find({}).lean();

    console.log({ requser: req.user, isAdmin: req.user.role === "admin" });
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Count the number of sheets per user
    const sheetCounts = await Sheet.aggregate([
      {
        $group: {
          _id: "$userId",
          appsCount: { $sum: 1 }
        }
      }
    ]);

    // Convert the sheetCounts array into an object for quick lookup
    const sheetCountsMap = {};
    sheetCounts.forEach(item => {
      sheetCountsMap[item._id] = item.appsCount;
    });

    // Attach appsCount to each user
    const usersWithAppsCount = users.map(user => ({
      ...user,
      appsCount: sheetCountsMap[user._id] || 0 // Default to 0 if no sheets found
    }));

    res.status(200).json(usersWithAppsCount);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.put("/auth/approve", async (req, res) => {
  console.log("API Hit: /auth/approve");

  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = !user.isApproved; // Toggle approval status
    await user.save();
    const updatedUsers = await User.find({});

    // Count the number of sheets per user
    const sheetCounts = await Sheet.aggregate([
      {
        $group: {
          _id: "$userId",
          appsCount: { $sum: 1 }
        }
      }
    ]);

    // Convert the sheetCounts array into an object for quick lookup
    const sheetCountsMap = {};
    sheetCounts.forEach(item => {
      sheetCountsMap[item._id] = item.appsCount;
    });

    // Attach appsCount to each user
    const usersWithAppsCount = updatedUsers.map(user => ({
      ...user.toObject(),
      appsCount: sheetCountsMap[user._id.toString()] || 0 // Default to 0 if no sheets found
    }));

    res.status(200).json({ message: "User approval status updated", usersWithAppsCount });
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/auth/updateRole/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log({ id, role });

    if (!id || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUsers = await User.find({}); // Fetch updated user list

    // Count the number of sheets per user
    const sheetCounts = await Sheet.aggregate([
      {
        $group: {
          _id: "$userId",
          appsCount: { $sum: 1 }
        }
      }
    ]);

    // Convert the sheetCounts array into an object for quick lookup
    const sheetCountsMap = {};
    sheetCounts.forEach(item => {
      sheetCountsMap[item._id] = item.appsCount;
    });

    // Attach appsCount to each user
    const usersWithAppsCount = updatedUsers.map(user => ({
      ...user.toObject(),
      appsCount: sheetCountsMap[user._id.toString()] || 0 // Default to 0 if no sheets found
    }));

    return res.status(200).json({ message: "User role updated", clients: usersWithAppsCount });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.delete("/auth/deleteUser/:id", async (req, res) => {
  console.log("API Hit: /auth/deleteUser");

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUsers = await User.find({});

    const sheetCounts = await Sheet.aggregate([
      {
        $group: {
          _id: "$userId",
          appsCount: { $sum: 1 }
        }
      }
    ]);

    // Convert the sheetCounts array into an object for quick lookup
    const sheetCountsMap = {};
    sheetCounts.forEach(item => {
      sheetCountsMap[item._id] = item.appsCount;
    });

    // Attach appsCount to each user
    const usersWithAppsCount = updatedUsers.map(user => ({
      ...user.toObject(),
      appsCount: sheetCountsMap[user._id.toString()] || 0 // Default to 0 if no sheets found
    }));

    res.status(200).json({ message: "User deleted successfully", usersWithAppsCount });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const convertArrayToJSON = (data, hiddenCol) => {
  // The first array contains the keys (headers)
  const keys = data[0];

  // Create a Set for fast lookup of hidden columns
  const hiddenSet = new Set(hiddenCol);

  // const jsonData = data;

  // Map the rest of the arrays to JSON objects
  const jsonData = data.slice(1).map((item, index) => {
    const jsonObject = {};

    keys.forEach((key, i) => {
      // Include only keys that are not in the hiddenSet
      if (!hiddenSet.has(key.replace(/\s+/g, '_').toLowerCase())) {
        jsonObject[key.replace(/\s+/g, '_').toLowerCase()] = item[i]; // Replace spaces with underscores and make keys lowercase
      }
    });

    return { key_id: (index + 1).toString(), ...jsonObject }; // Add key_id
  });

  return jsonData;
};

async function copySpreadsheet(authClient, sheet_id, userId, appName) {
  const sheets = google.sheets({ version: "v4", auth: authClient });
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    // Get the source spreadsheet details to obtain its title
    const getSpreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheet_id,
    });

    const sourceSpreadsheetTitle = getSpreadsheetResponse.data.properties.title;

    // Get permissions to determine access (Owner/Shared)
    const permissionsResponse = await drive.permissions.list({
      fileId: sheet_id,
      fields: "permissions(id, role, type)",
    });

    // Determine if the user is the owner
    const ownerPermission = permissionsResponse.data.permissions.find(
      (perm) => perm.role.toLocaleLowerCase() === "owner"
    );
    const access = ownerPermission ? "owner" : "shared";

    // Get the last updated date of the spreadsheet
    const lastUpdatedResponse = await drive.files.get({
      fileId: sheet_id,
      fields: "modifiedTime",
    });
    const lastUpdatedDate = new Date();

    // Create a new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Copy of ${sourceSpreadsheetTitle}`,
        },
      },
    });
    const newSpreadsheetId = createResponse.data.spreadsheetId;

    const sourceSheets = getSpreadsheetResponse.data.sheets;

    for (const sheet of sourceSheets) {
      const sourceSheetId = sheet.properties.sheetId;
      const sourceSheetName = sheet.properties.title;

      console.log(
        `Copying sheet: ${sourceSheetName} with ID: ${sourceSheetId}`
      );

      // Prepare the request to copy the sheet
      const request = {
        spreadsheetId: sheet_id,
        sheetId: sourceSheetId,
        resource: {
          destinationSpreadsheetId: newSpreadsheetId,
        },
      };

      // Copy the sheet to the new spreadsheet
      const copyResponse = await sheets.spreadsheets.sheets.copyTo(request);

      // Rename the copied sheet to match the source sheet name
      const copiedSheetId = copyResponse.data.sheetId;
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: newSpreadsheetId,
        resource: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: copiedSheetId,
                  title: sourceSheetName,
                },
                fields: "title",
              },
            },
          ],
        },
      });

      console.log(`Sheet copied and renamed to: ${sourceSheetName}`);
    }

    // Delete the default "Sheet1" from the new spreadsheet
    const deleteSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: newSpreadsheetId,
      resource: {
        requests: [
          {
            deleteSheet: {
              sheetId: createResponse.data.sheets[0].properties.sheetId,
            },
          },
        ],
      },
    });

    // Retrieve details of the first sheet in the new spreadsheet
    const newSpreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: newSpreadsheetId,
    });


    const firstSheet = newSpreadsheetResponse.data.sheets[0];
    const firstSheetId = firstSheet.properties.sheetId;
    const firstSheetName = firstSheet.properties.title;
    const firstSheetUrl = `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}/edit#gid=${firstSheetId}`;

    const tabs = newSpreadsheetResponse.data.sheets;
    const sheetDetails = tabs.map(sheet => {
      const sheetId = sheet.properties.sheetId;
      const sheetName = sheet.properties.title;
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheet_id}/edit#gid=${sheetId}`;

      return {
        name: sheetName,
        url: sheetUrl,
        sheetId: sheetId,
      };
    });

    // Get the data range of the first sheet
    const firstSheetDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: newSpreadsheetId,
      range: `${firstSheetName}!A1:1`,
    });
    const firstTabHeader = firstSheetDataResponse.data.values[0];

    const firstTabDataRange = `${firstSheetName}!A1:${String.fromCharCode(
      64 + firstTabHeader.length
    )}`;

    let cardSettings = [
      { id: 0, title: "" },
      { id: 1, title: "" },
      { id: 2, title: "" },
      { id: 3, title: "" },
      { id: 4, title: "" },
      { id: 5, title: "" },
    ]

    if (appName == "Video Gallery") {
      cardSettings = [
        {
          id: 0,
          title: "Video Link",

        },
        {
          id: 1,
          title: "Thumbnail"
        },
        {
          id: 2, title: "Video Title",
          setting: {
            "fontStyle": "bold",
            "fontColor": "#333131",
            "fontSize": "20",
            "fontType": "Poppins"
          }
        },
        {
          id: 3,
          title: "Category",
          setting: {
            "fontStyle": "regular",
            "fontColor": "#B0B0B0",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
        {
          id: 4,
          title: "Descriptions",
          setting: {
            "fontStyle": "normal",
            "fontColor": "#333131",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
        {
          id: 5,
          title: "Sub Title",
          setting: {
            "fontStyle": "normal",
            "fontColor": "#B0B0B0",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
      ]
    }
    else if (appName == "People Directory") {
      cardSettings = [
        { id: 0, title: "Profile Picture" },
        { id: 1, title: "First Name" },
        { id: 2, title: "Job Title" },
        { id: 3, title: "Department" },
        { id: 4, title: "Email" },
        { id: 5, title: "Mobile" },
      ]
    }
    else if (appName == "Photo Gallery") {
      cardSettings = [
        { id: 0, title: "Image" },
        { id: 1, title: "Title" },
        { id: 2, title: "Topic" },
      ]
    }
    else if (appName == "Interactive Map") {
      cardSettings = [
        { id: 0, title: "Image" },
        { id: 1, title: "Longitude" },
        { id: 2, title: "Latitude" },
      ]
    }
    else if (appName == "Product Catalogue") {
      cardSettings = []
    }

    const res = {
      spreadsheetId: newSpreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}/edit`,
      firstSheetId: firstSheetId,
      firstSheetUrl: firstSheetUrl,
      firstSheetName: firstSheetName,
      firstTabDataRange: firstTabDataRange,
      firstTabHeader: firstTabHeader,
      spreadsheetName: `Copy of ${sourceSpreadsheetTitle}`,
      sheetDetails: sheetDetails,
      access: access, // Add access type
      lastUpdatedDate: lastUpdatedDate, // Add last updated date
    };

    // Save the sheet details to the database
    const newSheet = await Sheet.create({
      userId: userId,
      spreadsheetName: res.spreadsheetName,
      spreadsheetId: res.spreadsheetId,
      spreadsheetUrl: res.spreadsheetUrl,
      firstSheetName: res.firstSheetName,
      firstSheetId: res.firstSheetId,
      firstSheetUrl: res.firstSheetUrl,
      firstTabDataRange: res.firstTabDataRange,
      firstTabHeader: res.firstTabHeader,
      appName: appName,
      sheetDetails: res.sheetDetails,
      access: res.access, // Save access type
      lastUpdatedDate: res.lastUpdatedDate, // Save last updated date
      showInCard: cardSettings,
      productCatalogue: {
        headerSettings: {
          headerText: "CBXTREE Header",
          headerFont: "Poppins",
          headerFontColor: "#000000",
          headerFontSize: "16px",
          bg: "#ffffff",
          logoURL: "",
          tabTitle: "",
          reset: false,
          search: true,
        },
        cardSettings: {
          titles: {
            Title_1: {
              cardFont: "Poppins",
              cardFontColor: "#060606",
              cardFontSize: "30px",
              fontWeight: "600",
            },
            Title_2: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "13.249px",
              fontWeight: "400",
            },
            Title_3: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "16px",
              fontWeight: "400",
            },
            Title_4: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "14px",
              fontWeight: "400",
            },
            Title_5: {
              cardFont: "Poppins",
              cardFontColor: "#EE0505",
              cardFontSize: "14px",
              fontWeight: "500",
            }
          },
          numberOfColumns: "3",
          numberOfRows: "3",
        },
        footerSettings: {
          footers: {
            Footer_1: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif", // Add default font
              footerFontSize: "16px", // Add default size
              footerFontColor: "#000000", // Add default color
              bg: "#ffffff", // Add default background
            },
            Footer_2: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_3: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_4: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_5: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
          },
          socialMediaSettings: {
            facebook: "",
            youtube: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            socialMedia1: "",
          },
          mainFooter: "",
          footerColor: "#ffffff",
          footerBackground: "#000000",
          contactSettings: [
            { id: 1, name: "Address", text: "", isContactEditing: false },
            { id: 2, name: "Phone", text: "", isContactEditing: false },
            { id: 3, name: "Email", text: "", isContactEditing: false },
          ]
        }
      },
    });

    return newSheet;
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
}

async function addSpreadsheet(authClient, sheet_id, userId, sheetName, appName) {
  const sheets = google.sheets({ version: "v4", auth: authClient });
  const drive = google.drive({ version: "v3", auth: authClient });


  try {
    // Get the source spreadsheet details to obtain its title
    const getSpreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheet_id,
    });

    const sourceSpreadsheetTitle = getSpreadsheetResponse.data.properties.title;

    // Get permissions to determine access (Owner/Shared)
    const permissionsResponse = await drive.permissions.list({
      fileId: sheet_id,
      fields: "permissions(id, role, type)",
    });

    // Determine if the user is the owner
    const ownerPermission = permissionsResponse.data.permissions.find(
      (perm) => perm.role === "owner"
    );
    const access = ownerPermission ? "Owner" : "Shared";

    // Get the last updated date of the spreadsheet
    const lastUpdatedResponse = await drive.files.get({
      fileId: sheet_id,
      fields: "modifiedTime",
    });
    const lastUpdatedDate = new Date();

    // Extract all sheet names by looping over newSpreadsheetResponse.data.sheets
    const allSheetNames = getSpreadsheetResponse.data.sheets.map(sheet => sheet.properties.title);

    const firstSheet = getSpreadsheetResponse.data.sheets[0];
    const firstSheetId = firstSheet.properties.sheetId;
    const firstSheetName = firstSheet.properties.title;
    const firstSheetUrl = `https://docs.google.com/spreadsheets/d/${sheet_id}/edit#gid=${firstSheetId}`;

    const tabs = getSpreadsheetResponse.data.sheets;
    const sheetDetails = tabs.map(sheet => {
      const sheetId = sheet.properties.sheetId;
      const sheetName = sheet.properties.title;
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheet_id}/edit#gid=${sheetId}`;

      return {
        name: sheetName,
        url: sheetUrl,
        sheetId: sheetId,
      };
    });

    // Get the data range of the first sheet
    const firstSheetDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheet_id,
      range: `${firstSheetName}!A1:1`,
    });
    const firstTabHeader = firstSheetDataResponse.data.values[0];

    const columnToLetter = (columnNumber) => {
      let columnLetter = "";
      while (columnNumber > 0) {
        let remainder = (columnNumber - 1) % 26;
        columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
      }
      return columnLetter;
    };

    const lastColumnLetter = columnToLetter(firstTabHeader.length);
    const firstTabDataRange = `${firstSheetName}!A1:${lastColumnLetter}`;

    let cardSettings = [
      { id: 0, title: "" },
      { id: 1, title: "" },
      { id: 2, title: "" },
      { id: 3, title: "" },
      { id: 4, title: "" },
      { id: 5, title: "" },
    ]

    if (appName == "Video Gallery") {
      cardSettings = [
        {
          id: 0,
          title: "",

        },
        {
          id: 1,
          title: ""
        },
        {
          id: 2, title: "",
          setting: {
            "fontStyle": "bold",
            "fontColor": "#333131",
            "fontSize": "20",
            "fontType": "Poppins"
          }
        },
        {
          id: 3,
          title: "",
          setting: {
            "fontStyle": "regular",
            "fontColor": "#B0B0B0",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
        {
          id: 4,
          title: "",
          setting: {
            "fontStyle": "normal",
            "fontColor": "#333131",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
        {
          id: 5,
          title: "",
          setting: {
            "fontStyle": "normal",
            "fontColor": "#B0B0B0",
            "fontSize": "16",
            "fontType": "Poppins"
          }
        },
      ]
    }
    else if (appName == "People Directory") {
      cardSettings = [
        { id: 0, title: "" },
        { id: 1, title: "" },
        { id: 2, title: "" },
        { id: 3, title: "" },
        { id: 4, title: "" },
        { id: 5, title: "" },
      ]
    }
    else if (appName == "Photo Gallery") {
      cardSettings = [
        { id: 0, title: "" },
        { id: 1, title: "" },
        { id: 2, title: "" },
      ]
    }
    else if (appName == "Interactive Map") {
      cardSettings = [
        { id: 0, title: "Image" },
        { id: 1, title: "Longitude" },
        { id: 2, title: "Latitude" },
      ]
    }
    else if (appName == "Product Catalogue") {
      cardSettings = []
    }

    const res = {
      spreadsheetId: sheet_id,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheet_id}/edit`,
      firstSheetId: firstSheetId,
      firstSheetUrl: firstSheetUrl,
      firstSheetName: firstSheetName,
      firstTabDataRange: firstTabDataRange,
      firstTabHeader: firstTabHeader,
      spreadsheetName: sheetName,
      appName: appName,
      sheetDetails: sheetDetails,
      access: access, // Add access type
      lastUpdatedDate: lastUpdatedDate, // Add last updated date

    };

    // Save the sheet details to the database
    const newSheet = await Sheet.create({
      userId: userId,
      spreadsheetName: res.spreadsheetName,
      spreadsheetId: res.spreadsheetId,
      spreadsheetUrl: res.spreadsheetUrl,
      firstSheetName: res.firstSheetName,
      firstSheetId: res.firstSheetId,
      firstSheetUrl: res.firstSheetUrl,
      firstTabDataRange: res.firstTabDataRange,
      firstTabHeader: res.firstTabHeader,
      appName: appName,
      sheetDetails: sheetDetails,
      access: res.access, 
      lastUpdatedDate: res.lastUpdatedDate, 
      showInCard: cardSettings,
      productCatalogue: {
        headerSettings: {
          headerText: "CBXTREE Header",
          headerFont: "Poppins",
          headerFontColor: "#000000",
          headerFontSize: "16px",
          bg: "#ffffff",
          logoURL: "",
          tabTitle: "",
          reset: false,
          search: true,
        },
        cardSettings: {
          titles: {
            Title_1: {
              cardFont: "Poppins",
              cardFontColor: "#060606",
              cardFontSize: "30.533px",
              fontWeight: "600",
            },
            Title_2: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "13.249px",
              fontWeight: "400",
            },
            Title_3: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "15px",
              fontWeight: "400",
            },
            Title_4: {
              cardFont: "Poppins",
              cardFontColor: "#363636",
              cardFontSize: "13.249px",
              fontWeight: "400",
            },
            Title_5: {
              cardFont: "Poppins",
              cardFontColor: "#EE0505",
              cardFontSize: "14.249px",
              fontWeight: "500",
            }
          },
          numberOfColumns: "4",
          numberOfRows: "3",
        },
        footerSettings: {
          footers: {
            Footer_1: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif", // Add default font
              footerFontSize: "16px", // Add default size
              footerFontColor: "#000000", // Add default color
              bg: "#ffffff", // Add default background
            },
            Footer_2: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_3: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_4: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
            Footer_5: {
              Heading: {
                SubHeading1: "",
                SubHeading2: "",
                SubHeading3: "",
                SubHeading4: "",
                SubHeading5: "",
              },
              footerFont: "Arial, sans-serif",
              footerFontSize: "16px",
              footerFontColor: "#000000",
              bg: "#ffffff",
            },
          },
          socialMediaSettings: {
            facebook: "",
            youtube: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            socialMedia1: "",
          },
          mainFooter: "",
          footerColor: "#000000",
          footerBackground: "#ffffff",
          contactSettings: [
            { id: 1, name: "Address", text: "", isContactEditing: false },
            { id: 2, name: "Phone", text: "", isContactEditing: false },
            { id: 3, name: "Email", text: "", isContactEditing: false },
          ]
        }
      },
    });

    return newSheet;
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
}

// Define a function to rename the spreadsheet
async function renameSpreadsheet(authClient, spreadSheetID, newName) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const request = {
    spreadsheetId: spreadSheetID,
    resource: {
      requests: [
        {
          updateSpreadsheetProperties: {
            properties: {
              title: newName,  // The new name for the spreadsheet
            },
            fields: 'title',
          },
        },
      ],
    },
  };

  try {
    const response = await sheets.spreadsheets.batchUpdate(request);
    return response.data;

  } catch (error) {
    console.error('Error renaming spreadsheet:', error);
    throw new Error('Failed to rename spreadsheet');
  }
}

// Define a function to delete a row from a spreadsheet
async function deleteRowFromSpreadsheet(authClient, spreadSheetID, sheetName, rowIndex) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  // First, get the sheetId for the given sheetName
  const getSheetMetadata = await sheets.spreadsheets.get({
    spreadsheetId: spreadSheetID,
  });

  // Find the sheet ID for the specific sheet name
  const sheet = getSheetMetadata.data.sheets.find(
    (s) => s.properties.title === sheetName
  );

  if (!sheet) {
    throw new Error(`Sheet with name "${sheetName}" not found.`);
  }

  const sheetId = sheet.properties.sheetId;

  const request = {
    spreadsheetId: spreadSheetID,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // Sheets API uses zero-based indexing
              endIndex: rowIndex,  // The row index you want to delete
            },
          },
        },
      ],
    },
  };

  try {
    const response = await sheets.spreadsheets.batchUpdate(request);
    return response.data;
  } catch (error) {
    console.error('Error deleting row:', error);
    throw new Error('Failed to delete row');
  }
}

// Define a function to edit row data in a spreadsheet
async function editRowInSpreadsheet(authClient, spreadSheetID, sheetName, rowIndex, newData) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  // Define the range you want to update (e.g., "Sheet1!A5:E5" for row 5)
  const range = `${sheetName}!A${rowIndex}:${String.fromCharCode(64 + newData.length)}${rowIndex}`;

  const updateRequest = {
    spreadsheetId: spreadSheetID,
    range: range,
    valueInputOption: 'RAW', // Can also be 'USER_ENTERED' if you want Google Sheets to interpret data types
    resource: {
      values: [newData], // Pass the new row data here as an array
    },
  };

  try {
    // Update the row data
    await sheets.spreadsheets.values.update(updateRequest);

    // After successful update, get the entire sheet's data
    const getRequest = {
      spreadsheetId: spreadSheetID,
      range: `${sheetName}`,  // Get all data from the sheet
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);

    // Return the updated sheet data
    return getResponse.data;
  } catch (error) {
    console.error('Error editing row:', error);
    throw new Error('Failed to edit row data');
  }
}

// Define a function to add a row to a spreadsheet
async function addRowToSpreadsheet(authClient, spreadSheetID, sheetName, rowData) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const getRequest1 = { spreadsheetId: spreadSheetID, range: `${sheetName}!1:1` };
  const response = await sheets.spreadsheets.values.get(getRequest1);
  const firstRow = response.data.values[0];

  let temp = [];
  for (let j = 0; j < firstRow.length; j++) {
    let param = firstRow[j].replace(/\s+/g, '_').toLowerCase();
    temp[j] = rowData[param] ?? null;
  }
  console.log({ temp });

  // Append the new row
  const appendRequest = {
    spreadsheetId: spreadSheetID,
    range: `${sheetName}`, // The range of the sheet
    valueInputOption: 'RAW', // or 'USER_ENTERED' if you want Google Sheets to interpret the data
    insertDataOption: 'INSERT_ROWS', // Append the data as new rows
    resource: {
      values: [temp]//Pass the new row data as an array of arrays
    },
  };

  try {
    // Append the row
    await sheets.spreadsheets.values.append(appendRequest);

    // After appending, fetch the updated sheet data
    const getRequest = {
      spreadsheetId: spreadSheetID,
      range: `${sheetName}`,  // Get all data from the sheet
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);

    // Return the updated sheet data
    return getResponse.data;
  } catch (error) {
    console.error('Error adding row:', error);
    throw new Error('Failed to add row or fetch updated sheet data');
  }
}

app.post("/copySpreadsheet", authenticateToken, async (req, res) => {

  const sheet_id = req.body.spreadSheetID;
  const userId = req.user._id;
  const appName = req.body.appName;

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    const result = await copySpreadsheet(authClient, sheet_id, userId, appName);
    res.status(200).json(result);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/createNewSpreadsheet", authenticateToken, async (req, res) => {

  const sheet_id = req.body.spreadSheetID;
  const userId = req.user._id;
  const sheetName = req.body.sheetName;
  const appName = req.body.appName;
  console.log({ sheet_id, userId, sheetName, appName });

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    const result = await addSpreadsheet(authClient, sheet_id, userId, sheetName, appName);
    res.status(200).json(result);
    console.log({ result });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/renameSpreadsheet/:id", authenticateToken, async (req, res) => {

  const spreadSheetID = req.params.id;
  const newName = req.body.newname;
  const userId = req.user._id;

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Call the renameSpreadsheet function to rename the spreadsheet
    // const result = await renameSpreadsheet(authClient, spreadSheetID, newName);

    // Find the document in MongoDB and update its settings
    const updatedSheetSetting = await Sheet.findOneAndUpdate(
      { _id: spreadSheetID },  // Find by sheet and user
      { $set: { spreadsheetName: newName } },  // Update the sheet name in the DB
      { new: true, upsert: true }   // Return the updated document
    );

    if (!updatedSheetSetting) {
      return res.status(404).json({ error: 'Spreadsheet settings not found.' });
    }

    // Respond with the renamed spreadsheet and updated MongoDB settings
    res.status(200).json({
      message: "Spreadsheet renamed successfully",
      updatedSettings: updatedSheetSetting,
    });

  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/deleteRow", authenticateToken, async (req, res) => {
  const spreadSheetID = req.body.spreadSheetID;
  const sheetName = req.body.sheetName;
  const rowIndex = req.body.rowIndex;  // This should be the row number you want to delete (1-based index)

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Call the deleteRowFromSpreadsheet function to delete the row
    const result = await deleteRowFromSpreadsheet(authClient, spreadSheetID, sheetName, rowIndex);
    res.status(200).json(result);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/editRow", authenticateToken, async (req, res) => {
  const spreadSheetID = req.body.spreadSheetID;
  const sheetName = req.body.sheetName;
  const rowIndex = req.body.rowIndex;  // Row number to edit (1-based index)
  const newData = req.body.newData;  // Array of new row data (e.g., ["Name", "Age", "Country", ...])

  // console.log({ spreadSheetID, sheetName, rowIndex, newData });
  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  // try {
  //   // Call the editRowInSpreadsheet function to edit the row and get updated sheet data
  //   const updatedSheetData = await editRowInSpreadsheet(authClient, spreadSheetID, sheetName, rowIndex, newData);
  //   res.status(200).json({
  //     message: "Row updated successfully",
  //     updatedSheetData: updatedSheetData
  //   });
  // } catch (err) {
  //   console.log("error: ", err);
  //   res.status(500).json({ error: err.message });
  // }
});

app.post("/editMultipleRows", authenticateToken, async (req, res) => {
  const { spreadSheetID, sheetName, rowsToUpdate } = req.body;

  console.log("rowsToUpdate: ", rowsToUpdate);
  // `rowsToUpdate` is an array of objects like:
  // [{ key_id: '1', user_name: 'Ravi', email_address: 'RaviUdyogAccounts@gmail.com', ... }, ...]

  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Fetch the first row of the sheet to get the column names
    const getRequest1 = { spreadsheetId: spreadSheetID, range: `${sheetName}!1:1` };
    const response = await google.sheets({ version: 'v4', auth: authClient }).spreadsheets.values.get(getRequest1);
    const firstRow = response.data.values[0];
    console.log({ firstRow });

    const updatedSheetData = [];
    for (let i = 0; i < rowsToUpdate.length; i++) {
      let temp = [];
      for (let j = 0; j < firstRow.length; j++) {
        let param = firstRow[j].replace(/\s+/g, '_').toLowerCase();
        temp[j] = rowsToUpdate[i][param] ?? null;
      }
      console.log({ temp });
      updatedSheetData.push({ key_id: rowsToUpdate[i].key_id, rowData: temp });
    }


    // Process the rows to create batch update data
    const updateRequests = updatedSheetData.map((row) => {
      const { key_id, rowData } = row; // Extract key_id and the rest of the data
      const rowIndex = parseInt(key_id) + 1; // Compute row index (key_id + 1)

      // Map rowData into an array of values for the row
      const newData = rowData;

      // Define the range for this row update
      const range = `${sheetName}!A${rowIndex}:${String.fromCharCode(64 + newData.length)}${rowIndex}`;
      return {
        range: range,
        values: [newData],
      };
    });

    // Execute batch update
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const batchUpdateRequest = {
      spreadsheetId: spreadSheetID,
      resource: {
        data: updateRequests,
        valueInputOption: "RAW",
      },
    };

    await sheets.spreadsheets.values.batchUpdate(batchUpdateRequest);

    // Fetch the updated sheet data after updates
    const getRequest = {
      spreadsheetId: spreadSheetID,
      range: `${sheetName}`, // Get all data from the sheet
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);

    res.status(200).json({
      message: "Rows updated successfully",
      updatedSheetData: getResponse.data,
    });
  } catch (err) {
    console.error("Error updating multiple rows:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/deleteMultipleRows', authenticateToken, async (req, res) => {
  console.log("Received request to delete multiple rows");
  const { spreadSheetID, sheetName, rowsToDelete } = req.body;

  if (!spreadSheetID || !sheetName || !rowsToDelete) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Sort rows by key_id to ensure we delete them from bottom to top
    rowsToDelete.sort((a, b) => b.key_id - a.key_id);

    const sheets = google.sheets({ version: 'v4', auth: authClient });

    for (const row of rowsToDelete) {
      const rowIndex = parseInt(row.key_id) + 1; // Convert key_id to rowIndex (1-based)

      await deleteRowFromSpreadsheet(sheets, spreadSheetID, sheetName, rowIndex);
    }

    res.status(200).json({ message: 'Rows deleted successfully' });
  } catch (err) {
    console.error('Error deleting rows:', err);
    res.status(500).json({ error: err.message });
  }
});

async function deleteRowFromSpreadsheet(sheets, spreadSheetID, sheetName, rowIndex) {
  try {
    const requests = [
      {
        deleteDimension: {
          range: {
            sheetId: await getSheetIdByName(sheets, spreadSheetID, sheetName),
            dimension: 'ROWS',
            startIndex: rowIndex - 1, // 0-based index
            endIndex: rowIndex, // 0-based index
          },
        },
      },
    ];

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadSheetID,
      resource: { requests },
    });
  } catch (error) {
    console.error('Error deleting row:', error);
    throw new Error('Failed to delete row');
  }
}

async function getSheetIdByName(sheets, spreadSheetID, sheetName) {
  const response = await sheets.spreadsheets.get({ spreadsheetId: spreadSheetID });
  const sheet = response.data.sheets.find((sheet) => sheet.properties.title === sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  return sheet.properties.sheetId;
}

async function updateSharedWithPhotosByOwner(loggedInUserId) {
  // Step 1: Get all sheets owned by the user
  const sheets = await Sheet.find({ userId: loggedInUserId });

  if (!sheets.length) return console.log("No sheets found.");

  // Step 2: Extract all unique emails from sharedWith
  const allEmails = new Set();
  sheets.forEach(sheet => {
    sheet.sharedWith.forEach(entry => {
      if (entry.email) allEmails.add(entry.email);
    });
  });

  // Step 3: Query all users in one go
  const users = await User.find({ email: { $in: Array.from(allEmails) } });
  const emailToUserMap = Object.fromEntries(
    users.map(user => [user.email, user])
  );

  // Step 4: Update sharedWith in each sheet
  const bulkOps = [];

  for (const sheet of sheets) {
    let updated = false;
    const newSharedWith = sheet.sharedWith.map(entry => {
      const user = emailToUserMap[entry.email];
      if (user && (entry.photo !== user.profileUrl || String(entry.id) !== String(user._id))) {
        updated = true;
        return {
          ...entry.toObject(),
          photo: user.profileUrl || "",
          id: user._id
        };
      }
      return entry;
    });

    if (updated) {
      bulkOps.push({
        updateOne: {
          filter: { _id: sheet._id },
          update: { $set: { sharedWith: newSharedWith } }
        }
      });
    }
  }

  // Step 5: Bulk write to the database
  if (bulkOps.length) {
    await Sheet.bulkWrite(bulkOps);
    console.log(`${bulkOps.length} sheets updated.`);
  } else {
    console.log("No updates needed.");
  }
}

// Define the API endpoint
app.post("/addRow", authenticateToken, async (req, res) => {
  const spreadSheetID = req.body.spreadSheetID;
  const sheetName = req.body.sheetName;
  const rowData = req.body.rowData;  // Array of new row data (e.g., ["Name", "Age", "Country"])

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Call the addRowToSpreadsheet function to add the row and get the updated sheet data
    const updatedSheetData = await addRowToSpreadsheet(authClient, spreadSheetID, sheetName, rowData);
    res.status(200).json({
      message: "Row added successfully",
      updatedSheetData: updatedSheetData
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/getSheetData", authenticateToken, async (req, res) => {
  const { spreadSheetID, range } = req.body;
  const user = req.user; // Assuming you have middleware to set req.user
  const refreshToken = req.user.googleRefreshToken;

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: refreshToken,
  });

  const sheets = google.sheets({ version: "v4", auth: authClient });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetID,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: "No data found." });
      return;
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all spreadsheets for a user
app.post("/getSpreadSheets", authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const emailID = req.user.email;
  try {
    await updateSharedWithPhotosByOwner(userId);
    const sheets = await Sheet.find({ $or: [{ userId: userId }, { "sharedWith.email": emailID }] }).lean();
    const newSheets = sheets.map((sheet) => {
      var access = "";
      if (sheet.userId == userId) {
        access = "owner";
      } else {
        let tempSharedWith = sheet.sharedWith.find(access => access.email === emailID)
        console.log({ tempSharedWith });
        access = tempSharedWith.permission.toLowerCase();
      }
      return { ...sheet, access: access };
    })
    res.status(200).json(newSheets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spreadsheets" });
  }
});

// Route to get all spreadsheets for a user
// app.get("/getuser", authenticateToken, async (req, res) => {
//   try {
//     // let userDetails = req.user;
//     // userDetails.suggestedUsers = await getFlattenedSharedWithForUser(req.user._id);
//     console.log(req.user._id);
//     const suggestedUsers = await getFlattenedSharedWithForUser(req.user._id);
//     // Only use the pure document (removing Mongoose metadata)
//     const userDoc = req.user._doc ? req.user._doc : req.user; // fallback for plain objects

//     const userDetails = {
//       ...userDoc,
//       suggestedUsers
//     };

    

//     // console.log({ userDetails, suggestedUsers: await getFlattenedSharedWithForUser(userDetails._id) });
//     res.status(200).json(userDetails);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch user details" });
//   }
// });

app.get("/getuser", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const emailID = req.user.email;
    const userDoc = req.user._doc || req.user;

    // Fire updateSharedWithPhotos in background (don't block response)
    updateSharedWithPhotosByOwner(userId).catch(console.error);

    // Run both DB queries in parallel
    const [suggestedUsers, sheets] = await Promise.all([
      getFlattenedSharedWithForUser(userId),
      getUserSheets(userId, emailID)
    ]);

    const userDetails = {
      ...userDoc,
      suggestedUsers,
      sheets
    };

    res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});


const getUserSheets = async (userId, emailID) => {

  const sheets = await Sheet.find({
    $or: [{ userId: userId }, { "sharedWith.email": emailID }]
  }).lean();

  return sheets.map(sheet => {
    const access = sheet.userId.toString() === userId.toString()
      ? "owner"
      : (sheet.sharedWith.find(entry => entry.email === emailID)?.permission.toLowerCase() || "viewer");

    return { ...sheet, access };
  });

};


const getFlattenedSharedWithForUser = async (userId) => {
  if (!userId) {
    console.error(userId);
    throw new Error("User ID is required");
  }

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const sheets = await Sheet.find(
      {
        $or: [
          { userId: userId.toString() },
          { "sharedWith.id": objectId }
        ]
      },
      {
        sharedWith: 1,
        _id: 0
      }
    );

    const flatSharedWith = sheets.flatMap(sheet => sheet.sharedWith || []);

    // 🔥 Filter unique by email
    const seen = new Set();
    const uniqueSharedWith = flatSharedWith.filter(entry => {
      if (!entry.email) return false; // Skip entries without email
      const email = entry.email.toLowerCase(); // normalize
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });

    return uniqueSharedWith;
  } catch (error) {
    console.error("Error fetching sharedWith entries:", error);
    throw error;
  }
};


app.post("/refresh-token", authenticateToken, async (req, res) => {
  const refreshToken = req.body.refreshToken;

  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // authClient.setCredentials({ refresh_token: refreshToken });
    const { token } = await authClient.getAccessToken();
    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
});

// delete spreadsheet from sheet collection
app.delete("/deleteSpreadsheet/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the sheet by ID and user ID
    const sheet = await Sheet.findOneAndDelete({ _id: id, userId: userId });

    if (!sheet) {
      return res
        .status(404)
        .json({ error: "Spreadsheet not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Spreadsheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting spreadsheet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Update sheet details route (PUT request)
app.put('/spreadsheet/:id', authenticateToken, async (req, res) => {
  try {
    const SheetId = req.params.id; // Get the ID from the request params
    const updatedSpreadsheet = req.body; // Get the updated settings from the request body

    // Update the settings document in MongoDB
    const updatedSetting = await Sheet.findByIdAndUpdate(SheetId, updatedSpreadsheet, { new: true });

    if (!updatedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    // Return the updated settings
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addEmails/:id", authenticateToken, async (req, res) => {
  try {
    const { emails } = req.body;
    const SheetId = req.params.id;

    console.log({ emails });

    // Fetch spreadsheet details from MongoDB
    const sheetData = await Sheet.findById(SheetId);
    if (!sheetData) {
      return res.status(404).json({ message: "Sheet not found" });
    }

    const { spreadsheetId } = sheetData;

    // Create an OAuth2 client with stored credentials
    const authClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Set the user's refresh token
    authClient.setCredentials({
      refresh_token: req.user.googleRefreshToken,
    });

    // Initialize Google Drive API with authenticated OAuth client
    const drive = google.drive({ version: "v3", auth: authClient });

    // Loop through emails and add permissions
    for (const { email, permission } of emails) {
      let role = permission.toLowerCase() === "edit" ? "writer" : "reader";

      try {
        await drive.permissions.create({
          fileId: spreadsheetId,
          requestBody: {
            type: "user",
            role: role,
            emailAddress: email,
          },
          fields: "id",
        });

        console.log(`✅ Shared sheet with ${email} as ${role}`);
      } catch (error) {
        console.error(`❌ Failed to share with ${email}:`, error.message);
      }
    }

    // Update MongoDB to store shared emails
    const updatedSetting = await Sheet.findByIdAndUpdate(
      SheetId,
      { sharedWith: emails },
      { new: true }
    );

    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error("❌ Error in /addEmails:", error.message);
    res.status(500).json({ error: error.message });
  }
});

async function getSheetDetails(authClient, spreadSheetID) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  try {
    // Fetch the spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadSheetID,
    });

    const spreadsheetName = response.data.properties.title;
    // const sheetNames = response.data.sheets.map(sheet => sheet.properties.title);

    const tabs = response.data.sheets;
    const sheetDetails = tabs.map(sheet => {
      const sheetId = sheet.properties.sheetId;
      const sheetName = sheet.properties.title;
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadSheetID}/edit#gid=${sheetId}`;

      return {
        name: sheetName,
        url: sheetUrl,
        sheetId: sheetId,
      };
    });


    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadSheetID}`;

    // Get the ID and name of the first sheet
    const firstSheet = response.data.sheets[0];
    const firstSheetName = firstSheet.properties.title;

    // Fetch the data from the first sheet to determine the data range
    const rangeResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetID,
      range: firstSheetName,  // This fetches the entire data range where data is available
      majorDimension: 'ROWS'  // Fetch data row by row
    });

    const firstSheetDataRange = rangeResponse.data.range;  // This will return the range with actual data

    return {
      spreadsheetName,
      sheetDetails,
      sheetUrl,
      firstSheetDataRange,
    };
  } catch (error) {
    console.error('Error fetching sheet details:', error);
    throw new Error('Failed to fetch sheet details');
  }
}

// Define the API endpoint
app.post("/getSpreadsheetDetails", authenticateToken, async (req, res) => {
  const spreadSheetID = req.body.spreadSheetID;  // Spreadsheet ID from client

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Call the getSheetDetails function to retrieve sheet metadata
    const sheetDetails = await getSheetDetails(authClient, spreadSheetID);

    // Return the sheet details as response
    res.status(200).json({
      message: "Spreadsheet details fetched successfully",
      data: sheetDetails
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /getSheetDetails/{id}:
 *   get:
 *     summary: Get sheet details by ID
 *     tags: [Sheets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sheet ID to fetch details for
 *     responses:
 *       200:
 *         description: Sheet details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 spreadsheetName:
 *                   type: string
 *                 spreadsheetId:
 *                   type: string
 *                 appName:
 *                   type: string
 *                 settings:
 *                   type: object
 *       404:
 *         description: Sheet not found
 *       500:
 *         description: Server error
 */
app.get("/getSheetDetails/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the sheet in the database
    const sheetDetails = await Sheet.findById(id).lean();
    
    if (!sheetDetails) {
      return res.status(404).json({ error: "Sheet not found." });
    }

    // Check if the user has access to this sheet
    const userId = req.user._id;
    const userEmail = req.user.email;
    
    // Allow access if user is the owner or has been shared with
    const hasAccess = sheetDetails.userId.toString() === userId.toString() || 
                     sheetDetails.sharedWith?.some(entry => entry.email === userEmail);
    
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied." });
    }

    // Return the sheet details
    res.status(200).json(sheetDetails);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

async function appendBulkDataAndGetUpdatedData(authClient, originalSheetId, originalSheetName, bulkData) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  // Step 1: Append the bulk data to the original sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId: originalSheetId,
    range: originalSheetName, // Name of the original sheet to which data will be added
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: bulkData, // This should be the array of arrays of bulk data (rows)
    },
  });

  // Step 2: Fetch the updated sheet data after appending
  const updatedSheetResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: originalSheetId,
    range: originalSheetName, // Fetch the full range from the original sheet
  });

  return updatedSheetResponse.data;
}

// Define the API endpoint
app.post("/bulkCopyFromAnotherSheet", authenticateToken, async (req, res) => {
  const { originalSheetID, originalSheetName, bulkSheetID, bulkSheetName, bulkSheetRange } = req.body;

  // Create an OAuth2 client with the given credentials
  const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the refresh token for the OAuth2 client
  authClient.setCredentials({
    refresh_token: req.user.googleRefreshToken,
  });

  try {
    // Fetch bulk data from the other sheet
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const bulkSheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: bulkSheetID,
      range: `${bulkSheetName}!${bulkSheetRange}`, // e.g., 'Sheet1!A1:D10'
    });

    const bulkData = bulkSheetResponse.data.values;

    // Append bulk data to the original sheet and get updated data
    const updatedSheetData = await appendBulkDataAndGetUpdatedData(authClient, originalSheetID, originalSheetName, bulkData);

    // Step 2: Append the extracted data to the original sheet
    // const updatedSheetInfo = await bulkAddToSheet(authClient, originalSheetID, originalSheetName, bulkData);

    // Return the updated sheet details as a response
    res.status(200).json({
      message: "Bulk data copied and added successfully",
      updatedData: updatedSheetData,
    });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /getSheetRowData:
 *   post:
 *     summary: Get specific row data from sheet by ID and row number
 *     tags: [Sheets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sheetID
 *             properties:
 *               sheetID:
 *                 type: string
 *                 description: ID of the sheet to fetch
 *               rowNumber:
 *                 type: number
 *                 description: Row number to fetch (1-based index, optional if key_id is provided)
 *               key_id:
 *                 type: string
 *                 description: Key ID from the data to fetch (optional if rowNumber is provided)
 *     responses:
 *       200:
 *         description: Row data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The row data as JSON object
 *                 settings:
 *                   type: object
 *                   description: Sheet settings and configuration
 *       404:
 *         description: Sheet or row not found
 *       500:
 *         description: Server error
 */
app.post("/getSheetRowData", dynamicAuth, async (req, res) => {
  try {
    const { sheetID, rowNumber, key_id } = req.body;
    
    if (!sheetID || (!rowNumber && !key_id)) {
      return res.status(400).json({ error: "Sheet ID and either row number or key_id are required." });
    }

    // Use key_id if provided, otherwise use rowNumber
    const targetRowNumber = key_id ? parseInt(key_id) : rowNumber;

    // Fetch sheet details from database
    const sheetDetails = await Sheet.findById(sheetID).lean();
    if (!sheetDetails) {
      return res.status(404).json({ error: "Sheet not found." });
    }

    const spreadSheetID = sheetDetails.spreadsheetId;
    const fullRange = sheetDetails.firstTabDataRange;
    const sheetName = fullRange.split("!")[0];
    const sheetOwner = await User.findById(sheetDetails.userId).lean();

    if (!sheetOwner) {
      return res.status(404).json({ error: "Sheet owner not found." });
    }

    // Create OAuth2 client
    let authClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    authClient.setCredentials({ refresh_token: sheetOwner.googleRefreshToken });

    const sheets = google.sheets({ version: "v4", auth: authClient });

    // First, fetch the actual headers from the Google Sheet
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetID,
      range: `${sheetName}!1:1`,
    });

    const actualHeaders = headerResponse.data.values?.[0];
    if (!actualHeaders) {
      return res.status(404).json({ error: "Headers not found." });
    }

    // Fetch the specific row (targetRowNumber + 1 because Google Sheets is 1-based and we need to account for header)
    const targetRow = targetRowNumber + 1; // Add 1 to account for header row
    const range = `${sheetName}!A${targetRow}:${String.fromCharCode(64 + actualHeaders.length)}${targetRow}`;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetID,
      range: range,
    });

    const rowData = response.data.values?.[0];
    if (!rowData) {
      return res.status(404).json({ error: "Row not found." });
    }

    // Convert row data to JSON format using actual headers from the sheet
    const headers = actualHeaders;
    
    console.log("Headers:", headers);
    console.log("Row Data:", rowData);
    console.log("Target Row Number:", targetRowNumber);
    const jsonData = {};
    
    // Map headers to row data first
    headers.forEach((header, index) => {
      const key = header.replace(/\s+/g, '_').toLowerCase();
      jsonData[key] = rowData[index] || "";
    });

    // Debug: Log the mapping
    console.log("Header to Data Mapping:");
    headers.forEach((header, index) => {
      const key = header.replace(/\s+/g, '_').toLowerCase();
      console.log(`${header} (${key}) -> ${rowData[index]}`);
    });

    // Set key_id based on the S.No column or targetRowNumber
    if (jsonData["s.no"] && jsonData["s.no"] !== "") {
      jsonData.key_id = jsonData["s.no"];
    } else {
      jsonData.key_id = targetRowNumber.toString();
      jsonData["s.no"] = targetRowNumber.toString();
    }

    console.log("Final JSON Data:", jsonData);

    // Clean up settings object for response
    const cleanSettings = { ...sheetDetails };
    delete cleanSettings.__v; // Remove MongoDB version field

    return res.status(200).json({
      data: jsonData,
      settings: cleanSettings
    });

  } catch (error) {
    console.error("Error fetching row data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});