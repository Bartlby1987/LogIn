const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3');
const TokenGenerator = require('uuid-token-generator');
const tokenObj = new TokenGenerator(256, TokenGenerator.BASE62);
const statusResponse = {
    personNotExisted: {"401 Unauthorized": "Wrong password or login."},
    internalError: {"500 Unauthorized": " Internal Server Error."},
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

async function authorizeUser(loginPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            let createSessionTableSql = "CREATE TABLE IF NOT EXISTS usersSession (sessionId TEXT NOT NULL ," +
                "name TEXT NOT NULL,email TEXT NOT NULL UNIQUE, login TEXT NOT NULL UNIQUE ,password TEXT NOT NULL," +
                "profileInfo TEXT NOT NULL)";
            await execAsync(createSessionTableSql);

            let hashPassword = crypto.createHash('md5').update(loginPassword["password"]).digest('hex');

            let sqlExistedUser = `SELECT * FROM users WHERE login='${loginPassword["login"]}' AND ` +
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

                let userInfo = existedUser[0];
                let params = [token, userInfo["name"], userInfo["email"],
                    userInfo["login"], userInfo["password"], userInfo["profileInfo"]]
                await execAsync("INSERT INTO usersSession (sessionId,name,email,login,password,profileInfo) " +
                    " VALUES (?,?,?,?,?,?)", params);
                resolve({
                    sessionId: token,
                    name: userInfo["name"],
                    email: userInfo["email"],
                    login: userInfo["login"]
                })
            }
        } catch (error) {
            reject(statusResponse.internalError);
        }
        }
    )
}

async function getProfileInfo(token) {
    return new Promise(async (resolve, reject) => {
        try {
            let sqlPersonInfo = `SELECT * FROM usersSession WHERE sessionId='${token}'`;
            let sessionId = await execAsync(sqlPersonInfo);
            resolve(sessionId[0]);
        } catch (err) {
            reject(statusResponse.internalError);
        }
    });
}

async function logOutFromSession(token) {
    return new Promise(async (resolve, reject) => {
        try {
            let sqlDeleteSession = `DELETE FROM  usersSession   WHERE sessionId='${token}'`;
            await execAsync(sqlDeleteSession);
        } catch (err) {
            reject(statusResponse.internalError);
        }
    })
}

async function checkSession(token) {
    return new Promise(async (resolve, reject) => {
        try {

            let sqlPersonInfo = `SELECT * FROM usersSession WHERE sessionId='${token}'`;
            let sessionId = await execAsync(sqlPersonInfo);
            resolve(sessionId[0]);

        } catch (err) {
            reject(statusResponse.internalError);
        }
    });
}


module.exports = {
    authorizeUser: authorizeUser,
    getProfileInfo: getProfileInfo,
    checkSession: checkSession,
    logOutFromSession: logOutFromSession
}