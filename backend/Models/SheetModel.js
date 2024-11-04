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
    firstTabHeader: Array,
    appName: String,
    sheetDetails: Array,
    sharedWith:Array,
    tableSettings: Array,
    access: String,
    lastUpdatedDate: String,
});


module.exports = mongoose.model("Sheet", SheetSchema);