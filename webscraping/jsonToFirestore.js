const firebaseAdmin = require("firebase-admin");
const dotenv = require("dotenv").config();
const fs = require("fs");

const pathToAdminJSON = process.env.PATH_TO_FIREBASE_ADMIN_JSON; // this JSON file is also in the gitignore

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(pathToAdminJSON),
});

const db = firebaseAdmin.firestore(); // firestore
const auth = firebaseAdmin.auth(); // auth

fs.readFile(
    "activitiesAugmented.json",
    {
        encoding: "utf8",
    },
    async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const dataObj = JSON.parse(data); // dataObj is the parsed object of the JSON

        // this is JUST FOR NOW. of course don't use this in real data. btw, what is this img? GWH MUN?
        const randomImgURLForNow =
            "https://firebasestorage.googleapis.com/v0/b/nexus-ec.appspot.com/o/pfp%2FFMkxVa8w9uYGrMkPnSSZQcr0Zyk2?alt=media&token=856d5235-b2d7-45c5-8488-e0f2b494184c";
        const ref = db.collection("activities");
        for (let i = 0; i < dataObj.length; i++) {
            const activity = dataObj[i];
            const activityFormatted = {
                ...activity,
                // image is not too important (esp for MVP), although if we find a way to get imgs we should still add it
                image: Math.random() > 0.5 ? null : randomImgURLForNow,
                // this needs to be scraped from the site maybe? although we can push this for later
                inPerson: Math.random() > 0.5 ? true : false,
                // and this (if it's in person, where is it?)
                location: Math.random() > 0.5 ? "" : "San Francisco, CA",
                // and this (whether or not it's something anyone can join)
                anyoneCanJoin: Math.random() > 0.5 ? true : false,
                // this is time it was added to our db
                timeAdded: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                // and this (who is running this?)
                host: "Hello there!",
                // and this (start date of the event)
                startDate: new Date(),
                // and this (end date of the event)
                endDate: new Date(),
                // and this (whether or not it's paid)
                paid: Math.random() > 0.5 ? true : false,
                // we should also think about whether or not the deadline is passed??
            };
            console.log(i);
            await ref.add(activityFormatted);
        }
    }
);
