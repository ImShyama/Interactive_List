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
    showInCard: Array,
    showInProfile: Array,
    showInBox: Array,
    freezeCol: String,
    hiddenCol: Array,
    peopleDirectory: Object,
    accessType: {type: Object, default: {type: "public", password: ""}},
},{ timestamps: true });


module.exports = mongoose.model("Sheet", SheetSchema);