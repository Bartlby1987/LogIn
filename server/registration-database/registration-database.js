const fs = require("fs");
const crypto = require('crypto');

const statusResponse = {
    successful: {"200 OK": "Registration was successful"},
    loginUsed:{"409 Conflict": "This login is already in use by another person."},
    emailUsed: {"409 Conflict": "This email is already in use by another person."}
}
const path=__dirname +"/database.json"
let hashPassword=(password)=>{
    return crypto.createHash('md5').update(password).digest('hex');
}

function addUserRegistrationInformation(registrationData) {
    let personsInfo = fs.readFileSync(path, "utf8");
    let personsArray=null;
    let password=registrationData["password"];

    if (personsInfo === "") {
        registrationData["id"] = 1;
        registrationData["password"]=hashPassword(password);
        let usersData=[registrationData];
        fs.writeFileSync(path, JSON.stringify(usersData));
        return statusResponse.successful
    } else {
        personsArray=JSON.parse(personsInfo)
        for (let i = 0; i < personsArray.length; i++) {
            let userLogin = personsArray[i].login;
            let userEmail = personsArray[i].email;
            if (userLogin === registrationData.login) {
                return statusResponse.loginUsed
            } else if (userEmail === registrationData.email) {
                return statusResponse.emailUsed
            }
        }
    }
    registrationData["id"] =personsArray[personsArray.length-1]["id"]+1;
    registrationData["password"]=hashPassword(password);    personsArray.push(registrationData);
    fs.writeFileSync(path, JSON.stringify(personsArray));
    return statusResponse.successful
}

module.exports = {
    addUserRegistrationInformation:addUserRegistrationInformation
}
