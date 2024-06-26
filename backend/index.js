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
const { authenticateToken } = require("./Middlewares/AuthenticateToken")




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
  res.send(req.user)
})

const { GoogleDB } = require("./utils/GoogleSheetsClass.js")

app.post("/getSheetData", (req, res) => {

  const sheets = new GoogleDB({
    auth: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      refreshToken: req.user.googleRefreshToken || ""
    },
    spreadSheetLink: req.body.spreadSheetLink,
    spreadSheetName: req.body.spreadSheetName,
    schema: {
      name: { type: String },
      class: { type: String },
      school: { type: String },
    }
  })

  sheets.find({}).then(res => console.log(res))
})




app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
