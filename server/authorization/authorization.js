const fs = require("fs");
const badResponse = {"401 Unauthorized": "Wrong password or login."}
const crypto = require('crypto');
let session = {}
const notNeedInfoKey = ["password", "profileInfo"];

const deleteKeyFromObj = (object, keysArray) => {
    for (let i = 0; i < keysArray.length; i++) {
        delete object[keysArray[i]]
    }
    return object
}

function getSessionValue() {
    return Object.keys(session)
}

function logOutFromSession() {
    session = {};
}

function authorizeUser(loginPassword, token) {
    let personsInfo = fs.readFileSync("registration-database/database.json", "utf8");
    let personsInfoObj;
    let hashedPassword = crypto.createHash('md5').update(loginPassword["password"]).digest('hex');
    let login = loginPassword["login"];
    if (personsInfo === "") {
        return badResponse
    }
    personsInfoObj = JSON.parse(personsInfo);
    let mapPersonsInfoObj = new Map(Object.entries(personsInfoObj))
    for (let [, value] of mapPersonsInfoObj) {
        if (value.login === login && value.password === hashedPassword) {
            session[token] = JSON.parse(JSON.stringify(value))
            return deleteKeyFromObj(value, notNeedInfoKey)
        }
    }
    return badResponse
}

function getProfileInfo(token) {
    return session[token]
}

module.exports = {
    authorizeUser: authorizeUser,
    getProfileInfo: getProfileInfo,
    getSessionValue: getSessionValue,
    logOutFromSession: logOutFromSession
}