"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = require("bcrypt");
const database_1 = __importDefault(require("../utils/database/database"));
const session_1 = __importDefault(require("../utils/session"));
const router = express_1.Router();
const database = new database_1.default();
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    /**
        * It will perform the following checks:
            * Check if the email is correct.
            * Check if the email is on the database.
            * Check if the hashed password matches.
        * Note: If it fails to login, it won't show custom messages.
            * This is not an error, it's just not a good idea to display
            * which part of the login failed. Since it could facilitate
            * attacks.
    **/
    if (!email.includes('@') || !await database.isEmailAlreadyRegistered(email))
        return res.send({ success: false });
    /**
        * All checks were successful.
        * It will get the user from the database.
        * Compare hashed passwords.
        * If the hashed passwords match it will return a session id.
    **/
    const user = await database.isEmailAlreadyRegistered(email);
    if (!await bcrypt_1.compare(password, user.password))
        return res.send({ success: false });
    /**
        * The sessionId is just a hashed version of the email and hashed password.
        * It will be stored inside the user's object and used on the login.
        * On the frontend, it will be stored on local storage.
        * Whenever a user log's in it will be checked if the sessionId exists on local storage:
            * If it does, it will check if the sessionId is the same as the one on backend.
            * If it is, it will automatically log the user in.
    **/
    const sessionId = session_1.default(email, user.password);
    await database.addSession(email, sessionId);
    res.send({ success: true, sessionId });
});
exports.default = router;
