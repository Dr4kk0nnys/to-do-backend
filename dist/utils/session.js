"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
    * To create a session id, the function will need:
        * User's email.
        * User's hashed password.
    
    * Note: The password will be hashed for obvious security reasons.
        * It's never a good idea to use plain-text passwords.
**/
function createSessionId(email, hashedPassword) {
    return crypto_1.createHash('md5').update(email + hashedPassword).digest('hex');
}
exports.default = createSessionId;
