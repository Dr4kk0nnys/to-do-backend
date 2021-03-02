"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checks_1 = require("../utils/database/checks");
const database_1 = __importDefault(require("../utils/database/database"));
const router = express_1.Router();
const database = new database_1.default();
router.get('/:sessionId', async (req, res) => {
    /* List all to do's being guided by the sessionId. */
    const { sessionId } = req.params;
    const check = await checks_1.sessionCheck(sessionId);
    if (!check)
        return res.send({ success: false, sessionId });
    const { user } = check;
    /* Not async since it uses find instead of findOne */
    const toDos = database.getToDosByEmail(user.email);
    res.send({ success: true, dues: await toDos.toArray() });
});
router.post('/', async (req, res) => {
    /* Creates a new to do. */
    const { sessionId, title, deadline, parent, isCompleted, isFavorite, styles } = req.body;
    const check = await checks_1.sessionCheck(sessionId);
    if (!check)
        return res.send({ success: false, sessionId });
    const objectCheck = await checks_1.toDoObjectCheck({ sessionId, title, deadline, parent, isCompleted, isFavorite, styles });
    if (!objectCheck)
        return res.send({ success: false });
    await database.insertToDo(objectCheck);
    res.send({ success: true });
});
router.put('/', async (req, res) => {
    /* Updates an existing to do. */
    const { sessionId, title, newTitle } = req.body;
    const check = await checks_1.sessionCheck(sessionId);
    if (!check)
        return res.send({ success: false, sessionId });
    if (!title || typeof (title) !== 'string')
        return res.send({ success: false });
    if (!newTitle || typeof (newTitle) !== 'string' || await database.isToDoTitleAlreadyBeingUsed(newTitle))
        return res.send({ success: false });
    await database.updateToDoByTitle({ sessionId, title, newTitle });
    res.send({ success: true });
});
router.put('/styles/', async (req, res) => {
    /* Adding new styles to an existing to do. */
    const { sessionId, title, isCompleted, isFavorite, styles } = req.body;
    const check = await checks_1.sessionCheck(sessionId);
    if (!check)
        return res.send({ success: false, sessionId });
    if (!title || typeof (title) !== 'string')
        return res.send({ success: false });
    if (typeof (isCompleted) !== 'boolean')
        return res.send({ success: false });
    if (typeof (isFavorite) !== 'boolean')
        return res.send({ success: false });
    if (!styles)
        return res.send({ success: false });
    if (typeof (styles.isBold) !== 'boolean')
        return res.send({ success: false });
    if (typeof (styles.isItalic) !== 'boolean')
        return res.send({ success: false });
    if (!styles.color || typeof (styles.color) !== 'string')
        return res.send({ success: false });
    await database.updateStylesByTitle({ email: check.user.email, title, isCompleted, isFavorite, styles });
    res.send({ success: true });
});
router.delete('/', async (req, res) => {
    /* Removes an existing to do. */
    const { sessionId, title } = req.body;
    const check = await checks_1.sessionCheck(sessionId);
    if (!check)
        return res.send({ success: false, sessionId });
    if (!title || typeof (title) !== 'string')
        return res.send({ success: false });
    const { user } = check;
    await database.removeToDoByTitle({ email: user.email, title: title.trim() });
    return res.send({ success: true });
});
exports.default = router;
