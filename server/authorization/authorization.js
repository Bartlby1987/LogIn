const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3');
const notNeedInfoKey = ["password", "profileInfo"];
const TokenGenerator = require('uuid-token-generator');
const tokenObj = new TokenGenerator(256, TokenGenerator.BASE62);


const statusResponse = {
    personNotExisted: {"40 Unauthorized": "Wrong password or login."},
}

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


// function generateToken(sessionTokens) {
//     if (sessionTokens.length === 0) {
//         return token
//     }
//     for (let i = 0; i < sessionTokens.length; i++) {
//         if (sessionTokens[i] !== token) {
//             return token
//         }
//     }
//     generateToken()
// }


async function authorizeUser(loginPassword) {
    return new Promise(async (resolve, reject) => {

        try {
            let hashPassword =crypto.createHash('md5').update(loginPassword["password"]).digest('hex');

            let sqlExistedUser = `SELECT login, password FROM users WHERE login='${loginPassword["login"]}' AND ` +
                `password='${hashPassword}'`;
            let existedUser = await execAsync(sqlExistedUser);
            if (!existedUser || existedUser.length === 0) {
                reject(statusResponse.personNotExisted)
            } else {
                let i = 0;
                let token;
                while (true) {
                    i++;
                    token = tokenObj.generate();
                    let sqlExistedSessionWithToken = `SELECT sessionId FROM usersSession WHERE sessionId='${token}'`;
                    let sessionId = await execAsync(sqlExistedSessionWithToken);
                    if (!sessionId || sessionId.length === 0) {
                        break;
                    }
                }
                let sqlSessionUserData = `SELECT * FROM users WHERE login='${loginPassword["login"]}' AND ` +
                    `password='${hashPassword}'`;
                let sessionUserData = await execAsync(sqlSessionUserData);
                let createSessionTableSql = "CREATE TABLE IF NOT EXISTS usersSession (sessionId TEXT NOT NULL ," +
                    "name TEXT NOT NULL,email TEXT NOT NULL UNIQUE, login TEXT NOT NULL UNIQUE ,password TEXT NOT NULL," +
                    "profileInfo TEXT NOT NULL)";
                await execAsync(createSessionTableSql);
                let params = [token, sessionUserData["name"], sessionUserData["email"],
                    sessionUserData["login"], sessionUserData["password"], sessionUserData["profileInfo"]]
                await execAsync("INSERT INTO usersSession VALUES (?,?,?,?,?,?)", params);


            }


            // let params = [registrationData["name"], registrationData["email"],
            //     registrationData["login"], hashPassword(registrationData["password"]), registrationData["profileInfo"]];
            // await execAsync("INSERT INTO users VALUES (?,?,?,?,?)", params);
        } catch (error) {
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