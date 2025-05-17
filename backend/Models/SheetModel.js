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
    // sharedWith:{type: [{email: String, permission: String, photo: String, id: mongoose.Schema.Types.ObjectId, ref:"user"}], default: []},
    sharedWith: {
        type: [{
          email: String,
          permission: String,
          photo: { type: String, default: "" },
          id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
        }],
        default: []
      }
    ,      
    tableSettings: Array,
    access: String,
    lastUpdatedDate: String,
    showInCard: Array,
    showInProfile: Array,
    showInBox: Array,
    freezeCol: String,
    hiddenCol: Array,
    peopleDirectory: Object,
    productCatalogue: Object,
    accessType: {type: Object, default: {type: "public", password: ""}},
    filterSettings: {type: Object, default: {filters:[]}}
},{ timestamps: true });


module.exports = mongoose.model("Sheet", SheetSchema);