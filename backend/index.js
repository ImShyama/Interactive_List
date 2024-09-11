const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;
const bodyParser = require("body-parser");
// const { GoogleDB } = require("googlesheets-raghbir");
const { authenticateToken } = require("./Middlewares/AuthenticateToken");
const { google } = require("googleapis");
const Sheet = require("./Models/SheetModel.js");
const fetchuser = require("./Middlewares/FetchUser.js");

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

app.use(authenticateToken);

app.get("/getUserData", (req, res) => {
  res.send(req.user);
});

async function copySpreadsheet(authClient, sheet_id, userId, appName) {
  const sheets = google.sheets({ version: "v4", auth: authClient });

  try {
    // Get the source spreadsheet details to obtain its title
    const getSpreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheet_id,
    });

    const sourceSpreadsheetTitle = getSpreadsheetResponse.data.properties.title;

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
    });

    console.log("All sheets copied successfully.", newSheet);
    return newSheet;
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
}

async function addSpreadsheet(authClient, sheet_id, userId, appName) {
  const sheets = google.sheets({ version: "v4", auth: authClient });

  try {
    // Get the source spreadsheet details to obtain its title
    const getSpreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheet_id,
    });
    console.log("spradesheet", getSpreadsheetResponse);

    const sourceSpreadsheetTitle = getSpreadsheetResponse.data.properties.title;

    console.log("title", sourceSpreadsheetTitle);

    // Create a new spreadsheet
    // const createResponse = await sheets.spreadsheets.create({
    //   resource: {
    //     properties: {
    //       title: `Copy of ${sourceSpreadsheetTitle}`,
    //     },
    //   },
    // });
    // const newSpreadsheetId = createResponse.data.spreadsheetId;
    // console.log("New Spreadsheet ID:", newSpreadsheetId);

    // const sourceSheets = getSpreadsheetResponse.data.sheets;

    // for (const sheet of sourceSheets) {
    //   const sourceSheetId = sheet.properties.sheetId;
    //   const sourceSheetName = sheet.properties.title;

    //   console.log(
    //     `Copying sheet: ${sourceSheetName} with ID: ${sourceSheetId}`
    //   );

    //   // Prepare the request to copy the sheet
    //   const request = {
    //     spreadsheetId: sheet_id,
    //     sheetId: sourceSheetId,
    //     resource: {
    //       destinationSpreadsheetId: newSpreadsheetId,
    //     },
    //   };

    //   // Copy the sheet to the new spreadsheet
    //   const copyResponse = await sheets.spreadsheets.sheets.copyTo(request);

    //   // Rename the copied sheet to match the source sheet name
    //   const copiedSheetId = copyResponse.data.sheetId;
    //   await sheets.spreadsheets.batchUpdate({
    //     spreadsheetId: newSpreadsheetId,
    //     resource: {
    //       requests: [
    //         {
    //           updateSheetProperties: {
    //             properties: {
    //               sheetId: copiedSheetId,
    //               title: sourceSheetName,
    //             },
    //             fields: "title",
    //           },
    //         },
    //       ],
    //     },
    //   });

    //   console.log(`Sheet copied and renamed to: ${sourceSheetName}`);
    // }

    // // Delete the default "Sheet1" from the new spreadsheet
    // const deleteSheetResponse = await sheets.spreadsheets.batchUpdate({
    //   spreadsheetId: newSpreadsheetId,
    //   resource: {
    //     requests: [
    //       {
    //         deleteSheet: {
    //           sheetId: createResponse.data.sheets[0].properties.sheetId,
    //         },
    //       },
    //     ],
    //   },
    // });
    // console.log("Default Sheet1 deleted:", deleteSheetResponse.data);

    // Retrieve details of the first sheet in the new spreadsheet
    // const newSpreadsheetResponse = await sheets.spreadsheets.get({
    //   spreadsheetId: newSpreadsheetId,
    // });
    const firstSheet = getSpreadsheetResponse.data.sheets[0];
    const firstSheetId = firstSheet.properties.sheetId;
    console.log("firstSheet", firstSheet);
    const firstSheetName = firstSheet.properties.title;
    const firstSheetUrl = `https://docs.google.com/spreadsheets/d/${sheet_id}/edit#gid=${firstSheetId}`;

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
      spreadsheetName: appName,
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
    });

    console.log("All sheets copied successfully.", newSheet);
    return newSheet;
  } catch (err) {
    console.error("The API returned an error: " + err);
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
    const result = await addSpreadsheet(authClient, sheet_id, userId, appName);
    res.status(200).json(result);
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
