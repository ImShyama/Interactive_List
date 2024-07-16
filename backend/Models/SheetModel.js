const mongoose = require("mongoose");

const SheetSchema = new mongoose.Schema({
    userId: String,
    spreadsheetName: String,
    spreadsheetId: String,
    spreadsheetUrl: String,
    firstSheetName: String,
    firstSheetId: String,
    firstSheetUrl: String,
    firstTabDataRange: String,
    firstTabHeader: Array
});


module.exports = mongoose.model("Sheet", SheetSchema);