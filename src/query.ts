import { Pool, QueryResult } from 'pg';

type Row = Object;

const buildInsertColumnString = (row: Row) =>
  `(${Object
    .keys(row)
    .join(', ')})`;

const buildInsertValueBindingString = (row: Row) =>
  `(${Object
    .keys(row)
    .map((_, i) => `$${i+1}`)
    .join(', ')})`;

const buildInsertQueryString = (table: string, row: Row) => `
    INSERT INTO ${table}
    ${buildInsertColumnString(row)}
    VALUES
    ${buildInsertValueBindingString(row)}
    RETURNING *
`;

export const buildDeleteQueryString = (table: string, pkName: string, keys: Array<string | number>) => `
  DELETE FROM ${table}
  WHERE ${pkName} IN (${keys.join(', ')})
`;

export const findPrimaryKeyName = ({ fields }: QueryResult): string => {
    const fieldDef = fields.find(field => field.columnID === 1);
    if (!fieldDef) {
        throw new Error(`No primary key found in result fieldset: ${JSON.stringify(fields)}`);
    }
    return fieldDef.name;
}

export const createRowToQueryMapper = (table: string, pool: Pool) =>
  (row: Row): Promise<QueryResult> =>
    pool.query(buildInsertQueryString(table, row), Object.values(row));
