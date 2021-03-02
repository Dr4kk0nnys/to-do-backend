"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/* Utils */
const database_1 = __importDefault(require("../utils/database"));
const sanitizer_1 = require("../utils/sanitizer");
/**
    * Configuration
    * It will initialize the router of the file.
    * It will initialize the database and all it's methods.
**/
const router = express_1.Router();
const database = new database_1.default();
/* List all to do's being guided by the sessionId, passed on the parameter. */
router.get('/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    if (!sessionId)
        return res.send({ success: false });
    /**
        * This check is very important for two reasons:
            1. If there is no sessionId, the user cannot be logged in.
            2. If there is no user with such sessionId, the user has an old sessionId.
        * In both scenarios the user must be logged out.
    **/
    if (!await database.getUserBySessionId(sessionId))
        return res.send({ success: false, sessionId });
    /* Basic sanitization */
    const _sessionId = sanitizer_1.sanitizeString(sessionId);
    /**
        * It will use the sessionId to identify the owner of the todo.
        * The getUserBySessionId() returns the user object ( or null ).
        * Once the user is passed through the checks, it will return all toDos.
        * The toDos will then be iterated on the frontend.
    **/
    const user = await database.getUserBySessionId(_sessionId);
    if (!user)
        return res.send({ success: false });
    /* Not async since it uses find instead of findOne */
    const toDos = database.getToDosByEmail(user.email);
    res.send({ success: true, dues: await toDos.toArray() });
});
/* Creates a new to do. */
router.post('/', async (req, res) => {
    /* Note: Those values are placeholders that are going to be sanitized later on the code. */
    const { sessionId, title, deadline } = req.body;
    if (!sessionId || !title || !deadline)
        return res.send({ success: false });
    /**
        * This check is very important for two reasons:
            1. If there is no sessionId, the user cannot be logged in.
            2. If there is no user with such sessionId, the user has an old sessionId.
        * In both scenarios the user must be logged out.
    **/
    if (!await database.getUserBySessionId(sessionId))
        return res.send({ success: false, sessionId });
    /* Basic sanitization */
    const [_sessionId, _title, _deadline] = sanitizer_1.sanitizeStrings([sessionId, title, deadline]);
    /**
        * A business rule is that the same user cannot add two to do's with the same title.
        * The following check will make sure no to do will have the same title as another.
    **/
    if (await database.isToDoTitleAlreadyBeingUsed(_title))
        return res.send({ success: false });
    /**
        * It will use the sessionId to identify the owner of the todo.
        * The getUserBySessionId() returns the user object ( or null ).
        * Once the user is passed through the checks, it will create the To Do.
    **/
    const user = await database.getUserBySessionId(_sessionId);
    if (!user)
        return res.send({ success: false });
    await database.insertToDo({ email: user.email, title: _title, deadline: _deadline });
    res.send({ success: true });
});
/* Updates an existing to do. */
router.put('/', async (req, res) => {
    /* Note: Those values are placeholders that are going to be sanitized later on the code. */
    const { sessionId, title, newTitle, newDeadline } = req.body;
    if (!sessionId || !title || !newTitle || !newDeadline)
        return res.send({ success: false });
    /**
        * This check is very important for two reasons:
            1. If there is no sessionId, the user cannot be logged in.
            2. If there is no user with such sessionId, the user has an old sessionId.
        * In both scenarios the user must be logged out.
    **/
    if (!await database.getUserBySessionId(sessionId))
        return res.send({ success: false, sessionId });
    /* Basic sanitization */
    const [_sessionId, _title, _newTitle, _newDeadline] = sanitizer_1.sanitizeStrings([sessionId, title, newTitle, newDeadline]);
    /**
        * A business rule is that the same user cannot add two to do's with the same title.
        * The following check will make sure no to do will have the same title as another.
    **/
    if (await database.isToDoTitleAlreadyBeingUsed(_newTitle))
        return res.send({ success: false });
    /**
        * It will use the sessionId to identify the owner of the todo.
        * The getUserBySessionId() returns the user object ( or null ).
        * Once the user is passed through the checks, it will update the To Do.
    **/
    const user = await database.getUserBySessionId(_sessionId);
    if (!user)
        return res.send({ success: false });
    await database.updateToDoByTitle({ email: user.email, title: _title, newTitle: _newTitle, newDeadline: _newDeadline });
    res.send({ success: true });
});
/* Removes an existing to do. */
router.delete('/', async (req, res) => {
    const { sessionId, title } = req.body;
    if (!title || !sessionId)
        return res.send({ success: false });
    /**
        * This check is very important for two reasons:
            1. If there is no sessionId, the user cannot be logged in.
            2. If there is no user with such sessionId, the user has an old sessionId.
        * In both scenarios the user must be logged out.
    **/
    if (!await database.getUserBySessionId(sessionId))
        return res.send({ success: false, sessionId });
    /* Basic sanitization */
    const [_sessionId, _title] = sanitizer_1.sanitizeStrings([sessionId, title]);
    /**
        * It will use the to do title to remove it.
        * The business rule "A to do cannot have the same title as another" comes in hand, since otherwise,
        the only way to identify to do's would be by it's id.
    **/
    const user = await database.getUserBySessionId(_sessionId);
    if (!user)
        return res.send({ success: false });
    await database.removeToDoByTitle({ email: user.email, title: _title });
    return res.send({ success: true });
});
exports.default = router;
