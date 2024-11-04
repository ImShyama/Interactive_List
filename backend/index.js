const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;
const bodyParser = require("body-parser");
const { authenticateToken } = require("./Middlewares/AuthenticateToken");
const { google } = require("googleapis");
const Sheet = require("./Models/SheetModel.js");
const User = require("./Models/UserModel.js");
const fetchuser = require("./Middlewares/FetchUser.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("./Models/UserModel");
const path = require("path");
const secret = process.env.TOKEN_KEY;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: ["http://localhost:1234"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

app.post("/getSheetDataWithID", async (req, res) => {

  const authHeader = req?.headers?.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
  console.log("Token: ", token);
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return;
    const user = await UserModel.findById(decoded.id).lean();
    if (!user) return;
    req.user = user;
  });

  const { sheetID } = req.body;

  const sheetDetails = await Sheet.findById(sheetID).lean();

  // const isValidUser = sheetDetails.sharedWith.find(access => access.email === req.user.email);
  // if (!isValidUser) {
  //   res.status(401).json({ error: "Unauthorized access." });
  //   return;
  // }
  // const permissions = isValidUser.permission ;

  const sheetOwner = await User.findById(sheetDetails.userId).lean();
  const spreadSheetID = sheetDetails.spreadsheetId;
  const range = sheetDetails.firstTabDataRange;

  const user = sheetOwner
  const refreshToken = user.googleRefreshToken;

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

    console.log("sheetOwner", sheetOwner);
    console.log("user", req.user);
    console.log(sheetOwner?._id.toString(), req?.user?._id.toString())
    if (sheetOwner?._id.toString() === req?.user?._id.toString()) {
      const permissions = "edit";
      res.status(200).json({ rows, permissions });
      return;
    }
    const permissions = "view";

    res.status(200).json({ rows, permissions });
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use(authenticateToken);

app.get("/getUserData", (req, res) => {
  res.send(req.user);
});

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
      (perm) => perm.role === "owner"
    );
    const access = ownerPermission ? "Owner" : "Shared";

    // Get the last updated date of the spreadsheet
    const lastUpdatedResponse = await drive.files.get({
      fileId: sheet_id,
      fields: "modifiedTime",
    });
    const lastUpdatedDate = new Date(lastUpdatedResponse.data.modifiedTime);

    // Create a new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Copy of ${sourceSpreadsheetTitle}`,
        },
      },
    });
    const newSpreadsheetId = createResponse.data.spreadsheetId;
    console.log("New Spreadsheet ID:", newSpreadsheetId);

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
    console.log("Default Sheet1 deleted:", deleteSheetResponse.data);

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
    });

    console.log("All sheets copied successfully.", newSheet);
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
    console.log("spradesheet", getSpreadsheetResponse);

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
    const lastUpdatedDate = new Date(lastUpdatedResponse.data.modifiedTime);

    // Extract all sheet names by looping over newSpreadsheetResponse.data.sheets
    const allSheetNames = getSpreadsheetResponse.data.sheets.map(sheet => sheet.properties.title);

    const firstSheet = getSpreadsheetResponse.data.sheets[0];
    const firstSheetId = firstSheet.properties.sheetId;
    console.log("firstSheet", firstSheet);
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

    console.log(sheetDetails);

    // Get the data range of the first sheet
    const firstSheetDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheet_id,
      range: `${firstSheetName}!A1:1`,
    });
    const firstTabHeader = firstSheetDataResponse.data.values[0];

    const firstTabDataRange = `${firstSheetName}!A1:${String.fromCharCode(
      64 + firstTabHeader.length
    )}`;

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

    console.log("res", res);

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
      access: res.access, // Save access type
      lastUpdatedDate: res.lastUpdatedDate, // Save last updated date
    });

    console.log("All sheets copied successfully.", newSheet);
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
    console.log("Spreadsheet renamed successfully: ", response.data);
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

  // Append the new row
  const appendRequest = {
    spreadsheetId: spreadSheetID,
    range: `${sheetName}`, // The range of the sheet
    valueInputOption: 'RAW', // or 'USER_ENTERED' if you want Google Sheets to interpret the data
    insertDataOption: 'INSERT_ROWS', // Append the data as new rows
    resource: {
      values: [rowData], // Pass the new row data as an array of arrays
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

app.post("/copySpreadsheet", async (req, res) => {
  console.log("user: ", req.user);
  console.log("refreshToken", req.user.googleRefreshToken);
  console.log("spreadSheetID", req.body.spreadSheetID);

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

app.post("/createNewSpreadsheet", async (req, res) => {
  console.log("user: ", req.user);
  console.log("refreshToken", req.user.googleRefreshToken);
  console.log("spreadSheetID", req.body.spreadSheetID);
  console.log(process.env.CLIENT_ID);
  console.log(process.env.CLIENT_SECRET);
  console.log(process.env.REDIRECT_URI);

  const sheet_id = req.body.spreadSheetID;
  const userId = req.user._id;
  const sheetName = req.body.sheetName;
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
    const result = await addSpreadsheet(authClient, sheet_id, userId, sheetName, appName);
    res.status(200).json(result);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/renameSpreadsheet/:id", async (req, res) => {

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
    const result = await renameSpreadsheet(authClient, spreadSheetID, newName);

    // Find the document in MongoDB and update its settings
    const updatedSheetSetting = await Sheet.findOneAndUpdate(
      { spreadsheetId: spreadSheetID, userId },  // Find by sheet and user
      { $set: { spreadsheetName: newName } },  // Update the sheet name in the DB
      { new: true, upsert: true }   // Return the updated document
    );

    if (!updatedSheetSetting) {
      return res.status(404).json({ error: 'Spreadsheet settings not found.' });
    }

    // Respond with the renamed spreadsheet and updated MongoDB settings
    res.status(200).json({
      message: "Spreadsheet renamed successfully",
      googleSheetResponse: result,
      updatedSettings: updatedSheetSetting,
    });

  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/deleteRow", async (req, res) => {
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
app.post("/editRow", async (req, res) => {
  const spreadSheetID = req.body.spreadSheetID;
  const sheetName = req.body.sheetName;
  const rowIndex = req.body.rowIndex;  // Row number to edit (1-based index)
  const newData = req.body.newData;  // Array of new row data (e.g., ["Name", "Age", "Country", ...])

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
    // Call the editRowInSpreadsheet function to edit the row and get updated sheet data
    const updatedSheetData = await editRowInSpreadsheet(authClient, spreadSheetID, sheetName, rowIndex, newData);
    res.status(200).json({
      message: "Row updated successfully",
      updatedSheetData: updatedSheetData
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// Define the API endpoint
app.post("/addRow", async (req, res) => {
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

app.post("/getSheetData", async (req, res) => {
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

app.get("/getSheetDetails/:id", async (req, res) => {
  try {
    const sheetId = req.params.id;
    const sheet = await Sheet.findById(sheetId);

    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }

    res.status(200).json(sheet);
  } catch (error) {
    console.error("Error fetching sheet details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all spreadsheets for a user
app.post("/getSpreadSheets", async (req, res) => {
  const userId = req.user._id;

  try {
    const sheets = await Sheet.find({ userId });
    res.status(200).json(sheets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spreadsheets" });
  }
});

// Route to get all spreadsheets for a user
app.get("/getuser", async (req, res) => {
  try {
    const userDetails = req.user;
    res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// route for refreshing the token
app.post("/refresh-token", async (req, res) => {
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
app.delete("/deleteSpreadsheet/:id", async (req, res) => {
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
app.put('/spreadsheet/:id', async (req, res) => {
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


app.post('/addEmails/:id', async (req, res) => {
  try {
    const { emails } = req.body;
    const SheetId = req.params.id; // Get the ID from the request params

    // Update the settings document in MongoDB
    const updatedSetting = await Sheet.findByIdAndUpdate(SheetId, { sharedWith: emails }, { new: true });

    if (!updatedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    // Return the updated settings
    res.status(200).json(updatedSetting);
    console.log(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Function to get sheet details including the actual data range of the first sheet
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
app.post("/getSpreadsheetDetails", async (req, res) => {
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
app.post("/bulkCopyFromAnotherSheet", async (req, res) => {
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


app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});