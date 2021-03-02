"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const passport_local_1 = require("passport-local");
const dotenv_1 = require("dotenv");
const passport_1 = __importDefault(require("passport"));
const database_1 = __importDefault(require("./database"));
/**
    * Configuration
    * It will initiate the environment variables.
    * It will initialize the database and it's methods.
**/
dotenv_1.config();
const database = new database_1.default();
/**
    * Initialize will be responsible for starting the whole session logic.
    * The idea behind this function is to call it as soon as possible.
    * When initialized, the whole login + session logic will be working.
**/
function initialize() {
    passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, async (email, password, done) => {
        /**
            * isEmailAlreadyRegistered will try to find an email with the parameter passed.
            * In case it succeeds, it returns the object found.
            * In case it doesn't, it returns null.
        **/
        const user = await database.isEmailAlreadyRegistered(email);
        if (!user)
            return done(null, false, { message: 'No user with that email' });
        /**
            * It will try to match the hashed passwords.
            * Both passwords are hashed.
            * In case of a match it will mark the user as authenticated and store a session.
            * In case there is no match it returns an error.
        **/
        if (await bcrypt_1.compare(password, user.password))
            return done(null, user);
        return done(null, false, { message: 'Incorrect password' });
    }));
    passport_1.default.serializeUser((user, done) => done(null, user)); /* It might be a problem. */
    passport_1.default.deserializeUser(async (id, done) => done(null, await database.isEmailAlreadyRegistered(id)));
}
exports.default = initialize;
