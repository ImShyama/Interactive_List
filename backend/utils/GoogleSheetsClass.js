const { google } = require('googleapis');
const { v4: uid } = require('uuid');
const axios = require('axios');

class GoogleDB {
    constructor({ auth, spreadSheetLink, spreadSheetName, schema }) {
        const { id, gid } = this.extractIdAndGid(spreadSheetLink);
        this.id = id;
        this.gid = gid;
        this.spreadSheetName = spreadSheetName;
        this.schema = schema;
        this.headers = [];

        this.isReady = new Promise(async (resolve, reject) => {
            try {
                await this.addGoogleAuth(async () => await this.getGoogleAuth(auth));
                await this.addHeaders(schema);

                resolve("success");
            } catch (error) {
                resolve("reject");
            }
        });
    }

    async addGoogleAuth(auth) {
        this.googleAuth = await auth();
        this.sheets = google.sheets({
            version: 'v4',
            auth: this.googleAuth
        });
    }

    async addHeaders(schema) {
        try {
            const getRes = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: `${this.spreadSheetName}!1:1`
            });

            let prevHeaders = getRes.data.values?.[0] || ["__ID"];

            if (prevHeaders[0] != "__ID") {
                prevHeaders = ["__ID", ...prevHeaders]
                const request = {
                    spreadsheetId: this.id,
                    resource: {
                        requests: [
                            {
                                insertDimension: {
                                    range: {
                                        sheetId: this.gid,
                                        dimension: "COLUMNS",
                                        startIndex: 0,
                                        endIndex: 1,
                                    },
                                    inheritFromBefore: false,
                                },
                            },
                            {
                                updateCells: {
                                    range: {
                                        sheetId: this.gid,
                                        startRowIndex: 0,
                                        endRowIndex: 1,
                                        startColumnIndex: 0,
                                        endColumnIndex: 1,
                                    },
                                    fields: "userEnteredValue",
                                    rows: [{ values: [{ userEnteredValue: { stringValue: "__ID" } }] }],
                                },
                            },
                        ],
                    },
                };
                // Execute the request to add "__ID" column
                await this.sheets.spreadsheets.batchUpdate(request);
                const { data: { values } } = await this.sheets.spreadsheets.values.get({
                    spreadsheetId: this.id,
                    range: `${this.spreadSheetName}`, // Get all values in column A
                });
                const lastDataRow = values ? values.length : 0;

                const idValues = Array.from({ length: lastDataRow - 1 }, (_, i) => [uid()]); // Incremental values from 1

                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: this.id,
                    range: `${this.spreadSheetName}!A2:A${lastDataRow + 1}`, // Exclude header row
                    valueInputOption: "USER_ENTERED",
                    resource: { values: idValues },
                });
            }
            const prevHeadersSet = new Set(prevHeaders);

            this.headers = [prevHeaders];

            for (let key in schema) {
                if (!prevHeadersSet.has(key)) {
                    prevHeaders.push(key);
                }
            }

            for (let i = 0; i < prevHeaders.length; i++) {
                if (schema[prevHeaders[i]]) {
                    schema[prevHeaders[i]].index = i;
                }
            }


            const appendRes = await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.id,
                range: `${this.spreadSheetName}!A1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [prevHeaders]
                }
            });
            // return appendRes;

            return appendRes
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(data) {
        await this.isReady;
        try {
            const newValues = [];
            const uniqueID = uid();
            newValues[0] = uniqueID;

            for (let key in this.schema) {
                if (this.schema[key].required && data[key] === undefined) {
                    throw new Error(`${key} field is required!`);
                }
                newValues[this.schema[key].index] = data[key];
            }

            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.id,
                range: this.spreadSheetName,
                valueInputOption: 'RAW',
                resource: { values: [newValues] },
            });

            return { ...data, __ID: uniqueID };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async find(query = {}) {
        await this.isReady;
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: this.spreadSheetName,
            });
            const data = this.convertDataToJSONWithFilters(response.data.values, query);
            return data;
        } catch (error) {
            console.error('Error fetching data from Google Sheets:', error);
            throw error;
        }
    }

    async findOne(query = {}) {
        await this.isReady;
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: this.spreadSheetName,
            });
            const data = this.convertDataToJSONWithFiltersOne(response.data.values, query);
            return data;
        } catch (error) {
            console.error('Error fetching data from Google Sheets:', error);
            throw error;
        }
    }

    async update(query, newData) {
        await this.isReady;
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: this.spreadSheetName,
            });
            let rowIndexToUpdate;
            let rowToUpdate;
            const allData = response.data.values;

            if (allData) {
                for (let i = 1; i < allData.length; i++) {
                    let filtered = false;
                    for (let key in query) {
                        if (key === "__ID") {
                            if (allData[i][0] !== query[key]) {
                                filtered = true;
                                break;
                            }
                        } else if (allData[i][this.schema[key].index] !== query[key]) {
                            filtered = true;
                            break;
                        }
                    }
                    if (filtered) continue;
                    rowIndexToUpdate = i;
                    rowToUpdate = allData[i];
                    break;
                }
            }

            if (!rowToUpdate) throw new Error("Cannot find row with this query!");

            for (let key in this.schema) {
                if (newData[key] !== undefined) {
                    if (this.schema[key].type !== typeof newData[key]) {
                        throw new Error(`${key} field should be of type ${this.schema[key].type}`);
                    }
                    rowToUpdate[this.schema[key].index] = newData[key];
                }
            }

            const updateValues = [rowToUpdate];

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.id,
                range: `${this.spreadSheetName}!A${rowIndexToUpdate + 1}:${rowIndexToUpdate + 1}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: updateValues },
            });

            for (let key in this.schema) {
                newData[key] = this.parseBooleanNumber(rowToUpdate[this.schema[key].index]);
            }

            return newData;
        } catch (error) {
            console.error('Error updating data in Google Sheets:', error);
            throw error;
        }
    }

    async delete(query) {
        await this.isReady;
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: this.spreadSheetName,
            });
            let rowIndexToUpdate;
            let rowToUpdate;
            const allData = response.data.values;

            if (allData) {
                for (let i = 1; i < allData.length; i++) {
                    let filtered = false;
                    for (let key in query) {
                        if (key === "__ID") {
                            if (allData[i][0] !== query[key]) {
                                filtered = true;
                                break;
                            }
                        } else if (allData[i][this.schema[key].index] !== query[key]) {
                            filtered = true;
                            break;
                        }
                    }
                    if (filtered) continue;
                    rowIndexToUpdate = i;
                    rowToUpdate = allData[i];
                    break;
                }
            }

            if (!rowToUpdate) throw new Error("Cannot find row with this query!");

            rowToUpdate.fill("");
            const updateValues = [rowToUpdate];

            const updateResponse = await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.id,
                range: `${this.spreadSheetName}!A${rowIndexToUpdate + 1}:${rowIndexToUpdate + 1}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: updateValues },
            });

            return updateResponse;
        } catch (error) {
            console.error('Error deleting data from Google Sheets:', error);
            throw error;
        }
    }

    convertDataToJSONWithFilters(data, query) {
        const keys = ["__ID", ...Object.keys(this.schema)];
        const jsonData = [];

        for (let i = 1; i < data.length; i++) {
            let filtered = false;
            for (let key in query) {
                if (key === "__ID") {
                    if (data[i][0] !== query[key]) {
                        filtered = true;
                        break;
                    }
                } else if (data[i][this.schema[key].index] !== query[key]) {
                    filtered = true;
                    break;
                }
            }
            if (filtered) continue;

            const row = data[i];
            const tempRow = [...data[i]];
            tempRow[0] = "";
            const rowJoin = tempRow.join("");
            if (rowJoin === "") continue;

            const obj = {};
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j]] = this.parseBooleanNumber(row[j] || "");
            }

            jsonData.push(obj);
        }
        return jsonData;
    }

    convertDataToJSONWithFiltersOne(data, query) {
        const keys = ["__ID", ...Object.keys(this.schema)];

        for (let i = 1; i < data.length; i++) {
            let filtered = false;
            for (let key in query) {
                if (key === "__ID") {
                    if (data[i][0] !== query[key]) {
                        filtered = true;
                        break;
                    }
                } else if (data[i][this.schema[key].index] !== query[key]) {
                    filtered = true;
                    break;
                }
            }
            if (filtered) continue;

            const row = data[i];
            const tempRow = [...data[i]];
            tempRow[0] = "";
            const rowJoin = tempRow.join("");
            if (rowJoin === "") continue;

            const obj = {};
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j]] = this.parseBooleanNumber(row[j] || "");
            }

            return obj;
        }
        return null;
    }

    parseBooleanNumber(val) {
        if (val === "TRUE") return true;
        if (val === "FALSE") return false;

        const num = Number(val);
        if (!isNaN(num) && val !== "") {
            return num;
        }

        return val;
    }

    extractIdAndGid(url) {
        const idMatch = url.match(/\/d\/(.*)\/edit/);
        const gidMatch = url.match(/gid=(\d+)/);

        const id = idMatch ? idMatch[1] : null;
        const gid = gidMatch ? gidMatch[1] : null;

        return { id, gid };
    }

    async getGoogleAuth(auth) {
        if (auth.refreshToken) {
            const oAuth2Client = new google.auth.OAuth2({
                clientId: auth.clientId,
                clientSecret: auth.clientSecret,
                redirectUri: auth.redirectUri
            });

            await oAuth2Client.setCredentials({
                refresh_token: auth.refreshToken
            });
            return oAuth2Client;
        } else {
            const tempAuth = new google.auth.GoogleAuth({
                credentials: auth,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            return await tempAuth.getClient();
        }
    }
}

module.exports = { GoogleDB };
