const firebaseAdmin = require("firebase-admin");
const dotenv = require("dotenv").config();
const fs = require("fs");

const pathToAdminJSON = process.env.PATH_TO_FIREBASE_ADMIN_JSON; // this JSON file is also in the gitignore

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(pathToAdminJSON),
});

const auth = firebaseAdmin.auth(); // auth

// this deletes all the users
// to delete all their data, just delete the "users" subcollection from the site
// DO NOT RUN THIS IN PROD!!
async function deleteAllUsers() {
    const userList = await auth.listUsers();
    userList.users.forEach(async (user) => {
        await auth.deleteUser(user.uid);
    });
}
