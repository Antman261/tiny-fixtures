import { Pool, QueryResult } from 'pg';
import { snakeCase } from 'snake-case';

type Row = Object;

const buildInsertColumnString = (row: Row, camelCased: boolean) =>
  `(${Object
    .keys(row)
    .map((k) => `"${(camelCased ? snakeCase(k) : k)}"`)
    .join(', ')})`;

const buildInsertValueBindingString = (row: Row) =>
  `(${Object
    .keys(row)
    .map((_, i) => `$${i+1}`)
    .join(', ')})`;

const buildInsertQueryString = (table: string, row: Row, camelCased: boolean) => `
    INSERT INTO "${(camelCased ? snakeCase(table) : table)}"
    ${buildInsertColumnString(row, camelCased)}
    VALUES
    ${buildInsertValueBindingString(row)}
    RETURNING *
`;

export const buildDeleteQueryString = (table: string, pkName: string, keys: Array<string | number>, camelCased: boolean) => {
    if (!table) {
        throw new Error(`No table given for delete query with pkName ${pkName}`)
    }
    if (!pkName) {
        throw new Error(`No pkName given for delete query on ${table}`);
    }
    if (keys.length === 0) {
        throw new Error(`No keys given for delete query on ${table}`);
    }
    const pkValues = keys.map((k) => (typeof k === "number") ? k : `'${k}'`)
    return `
  DELETE FROM "${(camelCased ? snakeCase(table) : table)}"
  WHERE "${(camelCased ? snakeCase(pkName) : pkName)}" IN (${pkValues.join(', ')})
`;
}

export const findPrimaryKeyName = ({ fields }: Pick<QueryResult, 'fields'>): string => {
    const fieldDef = fields.find(field => field.columnID === 1);
    if (!fieldDef) {
        throw new Error(`No primary key found in result fieldset: ${JSON.stringify(fields)}`);
    }
    return fieldDef.name;
}

export const createRowToQueryMapper = (table: string, pool: Pool, camelCased: boolean) =>
  (row: Row): Promise<QueryResult> =>
    pool.query(buildInsertQueryString(table, row, camelCased), Object.values(row));
