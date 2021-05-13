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

export const buildInsertQueryString = (table: string, row: Row) => `
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
