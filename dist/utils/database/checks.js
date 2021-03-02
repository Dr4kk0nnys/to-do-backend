"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCheck = exports.toDoObjectCheck = void 0;
const database_1 = __importDefault(require("./database"));
const objects_1 = require("./objects");
/* It will initialize the database and all it's methods. */
const database = new database_1.default();
const elementAndTypeof = (element, type) => element !== null && element !== undefined && typeof (element) === type;
const toDoObjectCheck = async (object) => {
    /**
        * Checks all possibly-wrong scenarios with the object. Such as:
            * Elements not being present.
            * Elements with wrong types.
            * Elements not following business rules.
        @param object
            object, holds to do's info.
        
        @returns The organized version of the object passed on the parameter.
    **/
    const { title, deadline, parent, isCompleted, isFavorite, styles } = object;
    if (!elementAndTypeof(title, 'string') || await database.isToDoTitleAlreadyBeingUsed(title))
        return false;
    if (!elementAndTypeof(deadline, 'string'))
        return false;
    /* The parent can be empty */
    if (!elementAndTypeof(parent, 'string'))
        return false;
    /* If the element has a parent, check this parent to see if it also has a parent, if it does, return an error. */
    if (parent !== '') {
        const parentElement = await database.isToDoTitleAlreadyBeingUsed(parent);
        if (parentElement.parent !== '')
            return false;
    }
    if (!elementAndTypeof(isCompleted, 'boolean'))
        return false;
    if (!elementAndTypeof(isFavorite, 'boolean'))
        return false;
    if (!styles)
        return false;
    const { isBold, isItalic, color } = styles;
    if (!elementAndTypeof(isBold, 'boolean'))
        return false;
    if (!elementAndTypeof(isItalic, 'boolean'))
        return false;
    if (!elementAndTypeof(color, 'string'))
        return false;
    return objects_1.organizeToDoObject(object);
};
exports.toDoObjectCheck = toDoObjectCheck;
const sessionCheck = async (sessionId) => {
    /**
        * Checks all possibly-wrong scenarios with the sessionId. Such as:
            * Not present.
            * Wrong type.
            * Old / wrong.
        @param sessionId
            string, unique to each user.

        @returns The user with such sessionId.
    **/
    if (!elementAndTypeof(sessionId, 'string'))
        return false;
    if (!await database.getUserBySessionId(sessionId))
        return false;
    const _sessionId = sessionId.trim();
    return {
        "user": await database.getUserBySessionId(_sessionId)
    };
};
exports.sessionCheck = sessionCheck;
