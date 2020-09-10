const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dataBase = require("../registration-database/registration-database");
const authorization = require("../authorization/authorization")
const TokenGenerator = require('uuid-token-generator');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.post('/registration', function (req, res) {
    let userInfo = req.body;
    let statusResponse = dataBase.addUserRegistrationInformation(userInfo);
    res.send(statusResponse);
});

router.post('/authorization', function (req, res) {
    let loginPassword = req.body;
    const tokenObj = new TokenGenerator(256, TokenGenerator.BASE62);

    function generateToken() {
        let sessionTokens = authorization.getSessionValue();
        let token = tokenObj.generate();
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

    let token = generateToken();
    let authorizationPersonInfo = authorization.authorizeUser(loginPassword, token);
    res.setHeader(`Set-Cookie`, `SESSION_ID=1; HttpOnly; Path=/`)
    res.send(JSON.stringify(authorizationPersonInfo));
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