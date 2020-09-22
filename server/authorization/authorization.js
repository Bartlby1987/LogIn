// const fs = require("fs");
// const badResponse = {"401 Unauthorized": "Wrong password or login."}
// const crypto = require('crypto');
// let session = {}


const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3');
const notNeedInfoKey = ["password", "profileInfo"];
const TokenGenerator = require('uuid-token-generator');
const tokenObj = new TokenGenerator(256, TokenGenerator.BASE62);


async function execAsync(sql, params) {
    params = params ? params : [];
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}


function generateToken(sessionTokens) {
    if (sessionTokens.length === 0) {
        return token
    }
    for (let i = 0; i < sessionTokens.length; i++) {
        if (sessionTokens[i] !== token) {
            return token
        }
    }
    generateToken()
}


async function authorizeUser(loginPassword) {
    return new Promise(async (resolve, reject) => {
        let sqlExistedUser = `SELECT login, password FROM users WHERE login='${loginPassword["login"]}' AND ` +
            `password='${loginPassword["password"]}'`;
        try {
            let existedUser = await execAsync(sqlExistedUser);
            if (existedUser || existedUser.length !== 0) {
                resolve(statusResponse.successful)
            }
            reject(statusResponse.loginUsed)

            // let params = [registrationData["name"], registrationData["email"],
            //     registrationData["login"], hashPassword(registrationData["password"]), registrationData["profileInfo"]];
            // await execAsync("INSERT INTO users VALUES (?,?,?,?,?)", params);


        }
    else
        {

        }

    }
catch
    (error)
    {
        reject("technical issue");
    }


}

)
}

// const deleteKeyFromObj = (object, keysArray) => {
//     for (let i = 0; i < keysArray.length; i++) {
//         delete object[keysArray[i]]
//     }
//     return object
// }

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