const fs = require("fs");
const crypto = require('crypto');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3');

const statusResponse = {
    successful: {"200 OK": "Registration was successful"},
    loginUsed: {"409 Conflict": "This login is already in use by another person."},
    emailUsed: {"409 Conflict": "This email is already in use by another person."}
}
const path = __dirname + "/database.json"
let hashPassword = (password) => {
    return crypto.createHash('md5').update(password).digest('hex');
}

function addUserRegistrationInformation(registrationData) {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS users (name TEXT NOT NULL,email TEXT NOT NULL UNIQUE," +
            "login TEXT NOT NULL UNIQUE ,password TEXT NOT NULL,profileInfo TEXT NOT NULL)");
        let l=registrationData["login"];
        let r=registrationData["password"];
        let login = db.run(`SELECT Key FROM users WHERE login=${l}`);
        let pass = db.run(`SELECT Key FROM users WHERE password=${r}`);
        console.log(login, pass)


        let stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");
        let password = registrationData["password"];
        registrationData["password"] = hashPassword(password);

        stmt.run(registrationData["name"], registrationData["email"],
            registrationData["login"], registrationData["password"], registrationData["profileInfo"]);

        stmt.finalize();

        db.each("SELECT rowid AS id,name, email,login,password,profileInfo FROM users", function (err, row) {
            console.log(row.id + ": " + row.name + ": " + row.email + ": " + row.login + ": " + row.password + ": " + row.profileInfo);
            db.close();
        });
    });
//
//
//     let personsInfo = fs.readFileSync(path, "utf8");
//     let personsArray = null;
//     // let password = registrationData["password"];
//     // registrationData["password"]=hashPassword(password);
//
//     if (personsInfo === "") {
//         registrationData["id"] = 1;
//         let usersData = [registrationData];
//         fs.writeFileSync(path, JSON.stringify(usersData));
//         return statusResponse.successful
//     } else {
//         personsArray = JSON.parse(personsInfo)
//         for (let i = 0; i < personsArray.length; i++) {
//             let userLogin = personsArray[i].login;
//             let userEmail = personsArray[i].email;
//             if (userLogin === registrationData.login) {
//                 return statusResponse.loginUsed
//             } else if (userEmail === registrationData.email) {
//                 return statusResponse.emailUsed
//             }
//         }
//     }
//     let password = registrationData["password"];
//     registrationData["id"] =personsArray[personsArray.length-1]["id"]+1;
//     registrationData["password"]=hashPassword(password);
//     personsArray.push(registrationData);
//     fs.writeFileSync(path, JSON.stringify(personsArray));
//     return statusResponse.successful
}

// module.exports = {
//     addUserRegistrationInformation:addUserRegistrationInformation
// }
let data = {name: "2", email: "2", login: "2", password: "2", profileInfo: "2"};
console.log(addUserRegistrationInformation(data));