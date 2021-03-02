"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeComparison = void 0;
const typeComparison = (object, type) => {
    if (Array.isArray(object)) {
        const types = [];
        for (const element of object) {
            if (typeof (element) === type)
                types.push(element);
            else
                return false;
        }
        return true;
    }
    else if (typeof (object) === 'string')
        return typeof (object) === type;
};
exports.typeComparison = typeComparison;
