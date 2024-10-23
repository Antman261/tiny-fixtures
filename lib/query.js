"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRowToQueryMapper = exports.findPrimaryKeyName = exports.buildDeleteQueryString = exports.buildInsertQueryString = void 0;
const snake_case_1 = require("snake-case");
const wrapDoubleQuotes = (string) => {
    if (string.indexOf('.') >= 0 || string.startsWith('"')) {
        return string;
    }
    return `"${string}"`;
};
const resolveTableSnakeCase = (table) => {
    const tableParts = table.split('.');
    return tableParts.length > 1
        ? `${tableParts[0]}.${wrapDoubleQuotes(snake_case_1.snakeCase(tableParts[1]))}`
        : wrapDoubleQuotes(snake_case_1.snakeCase(table));
};
const buildInsertColumnString = (row, convertToSnakecase) => `(${Object.keys(row)
    .map((k) => wrapDoubleQuotes(convertToSnakecase ? snake_case_1.snakeCase(k) : k))
    .join(', ')})`;
const buildInsertValueBindingString = (row) => `(${Object.keys(row)
    .map((_, i) => `$${i + 1}`)
    .join(', ')})`;
const buildInsertQueryString = (table, row, convertToSnakecase) => `
  INSERT INTO ${convertToSnakecase ? resolveTableSnakeCase(table) : wrapDoubleQuotes(table)}
  ${buildInsertColumnString(row, convertToSnakecase)}
  VALUES
  ${buildInsertValueBindingString(row)}
  RETURNING *
`;
exports.buildInsertQueryString = buildInsertQueryString;
const buildDeleteQueryString = (table, pkName, keys, convertToSnakecase) => {
    if (!table) {
        throw new Error(`No table given for delete query with pkName ${pkName}`);
    }
    if (!pkName) {
        throw new Error(`No pkName given for delete query on ${table}`);
    }
    if (keys.length === 0) {
        throw new Error(`No keys given for delete query on ${table}`);
    }
    const pkValues = keys.map((k) => (typeof k === 'number' ? k : `'${k}'`));
    return `
  DELETE FROM ${convertToSnakecase ? resolveTableSnakeCase(table) : wrapDoubleQuotes(table)}
  WHERE "${convertToSnakecase ? snake_case_1.snakeCase(pkName) : pkName}" IN (${pkValues.join(', ')})
`;
};
exports.buildDeleteQueryString = buildDeleteQueryString;
const findPrimaryKeyName = ({ fields, }) => {
    const fieldDef = fields.find((field) => field.columnID === 1);
    if (!fieldDef) {
        throw new Error(`No primary key found in result fieldset: ${JSON.stringify(fields)}`);
    }
    return fieldDef.name;
};
exports.findPrimaryKeyName = findPrimaryKeyName;
const createRowToQueryMapper = (table, pool, convertToSnakecase) => (row) => pool.query(exports.buildInsertQueryString(table, row, convertToSnakecase), Object.values(row));
exports.createRowToQueryMapper = createRowToQueryMapper;
