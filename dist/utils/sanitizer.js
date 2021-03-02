"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeStrings = exports.sanitizeString = void 0;
const sanitizeString = (str) => str.trim();
exports.sanitizeString = sanitizeString;
const sanitizeStrings = (strings) => strings.map(element => element.trim());
exports.sanitizeStrings = sanitizeStrings;
