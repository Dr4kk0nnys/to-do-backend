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
            * Check if the email is valid.
            * Check if the email is not on the database.
            * Check if the password attends the requirements.
    **/
    if (!email.includes('@'))
        return res.send({ success: false, errorCode: 0, message: 'Invalid Email!' });
    if (await database.isEmailAlreadyRegistered(email))
        return res.send({ success: false, errorCode: 1, message: 'Email Already Registered!' });
    /**
        * The password requirements are the following:
            * At least 10 characters.
            * At least 2 numbers.
            * At least 2 capital letters.
    **/
    const quickPasswordMatch = (match, length) => password.match(match) && password.match(match).length >= length;
    if (!(password.length >= 10) || !quickPasswordMatch(/[0-9]/g, 2) || !quickPasswordMatch(/[A-Z]/g, 2))
        return res.send({ success: false, errorCode: 2, message: 'Password does not follow the requirements!' });
    /**
        * All checks were successful.
        * Create the user on the database with email, password and sessionId.
        * The password will be hashed using the bcrypt module.
        * The sessionId will be stored on the database and returned to the frontend.
    **/
    const sessionId = session_1.default(email, await bcrypt_1.hash(password, 10));
    await database.insertUser({ email, password: await bcrypt_1.hash(password, 10), sessionId });
    return res.send({ success: true, sessionId });
});
exports.default = router;
