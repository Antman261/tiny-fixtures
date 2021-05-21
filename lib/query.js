"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRowToQueryMapper = exports.findPrimaryKeyName = exports.buildDeleteQueryString = void 0;
var buildInsertColumnString = function (row) {
    return "(" + Object
        .keys(row)
        .join(', ') + ")";
};
var buildInsertValueBindingString = function (row) {
    return "(" + Object
        .keys(row)
        .map(function (_, i) { return "$" + (i + 1); })
        .join(', ') + ")";
};
var buildInsertQueryString = function (table, row) { return "\n    INSERT INTO " + table + "\n    " + buildInsertColumnString(row) + "\n    VALUES\n    " + buildInsertValueBindingString(row) + "\n    RETURNING *\n"; };
var buildDeleteQueryString = function (table, pkName, keys) {
    if (!table) {
        throw new Error("No table given for delete query with pkName " + pkName);
    }
    if (!pkName) {
        throw new Error("No pkName given for delete query on " + table);
    }
    if (keys.length === 0) {
        throw new Error("No keys given for delete query on " + table);
    }
    return "\n  DELETE FROM " + table + "\n  WHERE " + pkName + " IN (" + keys.join(', ') + ")\n";
};
exports.buildDeleteQueryString = buildDeleteQueryString;
var findPrimaryKeyName = function (_a) {
    var fields = _a.fields;
    var fieldDef = fields.find(function (field) { return field.columnID === 1; });
    if (!fieldDef) {
        throw new Error("No primary key found in result fieldset: " + JSON.stringify(fields));
    }
    return fieldDef.name;
};
exports.findPrimaryKeyName = findPrimaryKeyName;
var createRowToQueryMapper = function (table, pool) {
    return function (row) {
        return pool.query(buildInsertQueryString(table, row), Object.values(row));
    };
};
exports.createRowToQueryMapper = createRowToQueryMapper;
