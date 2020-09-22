const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dataBase = require("../registration-database/registration-database");
const authorization = require("../authorization/authorization")
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/registration', async function (req, res) {
    let userInfo = req.body;
    try {
        let msg = await dataBase.addUserRegistrationInformation(userInfo);
        res.send(msg)
    } catch (error) {
        res.send(error)
    }

});

router.post('/authorization', async function (req, res) {
    let loginPassword = req.body;
    try {
        let authorizationPersonInfo = await authorization.authorizeUser(loginPassword);
        res.setHeader(`Set-Cookie`, `SESSION_ID=${authorizationPersonInfo["token"]}; HttpOnly; Path=/`)
        res.send(JSON.stringify(authorizationPersonInfo["responseObj"]));
    } catch (err) {
        res.send(err)
    }
});


router.post('/personInfo', function (req, res) {
    let userInfo = authorization.getProfileInfo(req.cookies.SESSION_ID)
    res.send(JSON.stringify(userInfo));
});

router.post('/logOut', function (req, res) {
    authorization.logOutFromSession()
    req.session = null
    res.clearCookie("SESSION_ID", {path: '/'})
    res.status(200).json('User Logged out')
});


module.exports = router;