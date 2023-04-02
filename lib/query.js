"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRowToQueryMapper = exports.findPrimaryKeyName = exports.buildDeleteQueryString = void 0;
var snake_case_1 = require("snake-case");
var buildInsertColumnString = function (row, convertToSnakecase) {
    return "(" + Object.keys(row)
        .map(function (k) { return "\"" + (convertToSnakecase ? snake_case_1.snakeCase(k) : k) + "\""; })
        .join(', ') + ")";
};
var buildInsertValueBindingString = function (row) {
    return "(" + Object.keys(row)
        .map(function (_, i) { return "$" + (i + 1); })
        .join(', ') + ")";
};
var buildInsertQueryString = function (table, row, convertToSnakecase) { return "\n    INSERT INTO \"" + (convertToSnakecase ? snake_case_1.snakeCase(table) : table) + "\"\n    " + buildInsertColumnString(row, convertToSnakecase) + "\n    VALUES\n    " + buildInsertValueBindingString(row) + "\n    RETURNING *\n"; };
var buildDeleteQueryString = function (table, pkName, keys, convertToSnakecase) {
    if (!table) {
        throw new Error("No table given for delete query with pkName " + pkName);
    }
    if (!pkName) {
        throw new Error("No pkName given for delete query on " + table);
    }
    if (keys.length === 0) {
        throw new Error("No keys given for delete query on " + table);
    }
    var pkValues = keys.map(function (k) { return (typeof k === 'number' ? k : "'" + k + "'"); });
    return "\n  DELETE FROM \"" + (convertToSnakecase ? snake_case_1.snakeCase(table) : table) + "\"\n  WHERE \"" + (convertToSnakecase ? snake_case_1.snakeCase(pkName) : pkName) + "\" IN (" + pkValues.join(', ') + ")\n";
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
var createRowToQueryMapper = function (table, pool, convertToSnakecase) {
    return function (row) {
        return pool.query(buildInsertQueryString(table, row, convertToSnakecase), Object.values(row));
    };
};
exports.createRowToQueryMapper = createRowToQueryMapper;
