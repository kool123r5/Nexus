const { readFile, writeFile } = require("fs").promises;

async function getData(spreadsheetId, range) {
    const { GoogleAuth } = require("google-auth-library");
    const { google } = require("googleapis");

    const credentials = JSON.parse(await readFile("sheetsCredentials.json"));

    const auth = new GoogleAuth({
        scopes: "https://www.googleapis.com/auth/spreadsheets",
        credentials,
    });

    const service = google.sheets({ version: "v4", auth });
    try {
        const result = await service.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        result.data.values.forEach((row) => {
            console.log(row);
        });
    } catch (err) {
        throw err;
    }
}

getData("1QnPO_3qaVlk1sGIjpGKRaXTFXm9siMMNL79WQsoD7RM", "rawData");
