const { readFile, writeFile } = require("fs").promises;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        const currentData = [];
        result.data.values.forEach(async (row) => {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            await new Promise((r) => setTimeout(r, 3000));

            const prompt = `
            I want data about the cost of an activity. This is some data that a stranger has given us.
            I want you to parse this data and convert it into a specified format.

            The data looks like this: 
            Currency of figures: ${row[10] == "" ? "This is a free and unpaid activity" : row[10]}
            Cost of activity: ${row[11] != "" ? row[11] : "unknown"}
            How much the opportunity pays the participant: ${row[12] != "" ? row[12] : "unknown"}

            I want you to return an object from this with 2 fields, one named "cost", and the other named "paid" (cost being the cost to the participant, like an entry fee, while paid meaning the participant is paid, like a salary)
            Both of these fields are arrays with 3 values that go in them.
            The first value in each array is a boolean, either true or false, that states whether or not that activity has a cost or does pay the participant. If, for example, there is an opportunity which has a cost but does not pay the participant, then the first value in the cost array is true, and the first value in the paid array is false.

            The second value in each array is the numberical value of the amount. DO NOT attempt any currency conversion here, just give a number. If any of them is none, like if the activity does not have a cost or does not pay the participants, give 0 here.

            The final value in each array is the currency the number is given in. This should be a 3 letter code. For example, the dollar symbol or simply the string of "dollar" should be put as "USD" here. If you are not sure about this, then write the string of "unknown".

            I do not want any response from you except this object with the 2 fields.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const geminiObj = text.slice(text.indexOf("{"), text.indexOf("}") + 1);
            const json = JSON.parse(geminiObj);
            const costArr = json["cost"];
            const paidArr = json["paid"];

            currentData.push({
                host: row[1],
                title: row[2],
                website: row[3],
                text: row[4],
                demographics: row[5].split(",").map((elem) => elem.trim()),
                age: row[6].split(",").map((elem) => elem.trim()),
                selective: row[7] == "Selective",
                mode: row[8] == "In person" ? "inPerson" : row[8] == "Remote / Online" ? "remote" : "hybrid",
                location: row[9] != "" ? row[9] : "unknown",
                startDate: row[13] != "" ? row[13] : "unknown",
                endDate: row[14] != "" ? row[14] : "unknown",
                deadline: row[15] != "" ? row[15] : "unknown",
                duration: row[16] != "" ? row[16] : "unknown",
                contributor: row[17] != "" ? row[17] : null,
                localToIndia: row[18] == "Yes",
                cost: costArr,
                paid: paidArr,
            });
            await writeFile("responseData.json", JSON.stringify(currentData));
        });
    } catch (err) {
        console.log(err);
    }
}

const data = getData("1QnPO_3qaVlk1sGIjpGKRaXTFXm9siMMNL79WQsoD7RM", "rawData");
