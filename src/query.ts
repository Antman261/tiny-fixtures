import { Pool, QueryResult } from 'pg';
import { snakeCase } from 'snake-case';

type Row = Record<string, any>;

const wrapDoubleQuotes = (string: string): string => {
  if (string.indexOf('.') >= 0 || string.startsWith('"')) {
    return string;
  }

  return `"${string}"`;
};

const resolveTableSnakeCase = (table: string): string => {
  const tableParts = table.split('.');

  return tableParts.length > 1
    ? `${tableParts[0]}.${wrapDoubleQuotes(snakeCase(tableParts[1]))}`
    : wrapDoubleQuotes(snakeCase(table));
};

const buildInsertColumnString = (row: Row, convertToSnakecase: boolean) =>
  `(${Object.keys(row)
    .map((k) => wrapDoubleQuotes(convertToSnakecase ? snakeCase(k) : k))
    .join(', ')})`;

const buildInsertValueBindingString = (row: Row) =>
  `(${Object.keys(row)
    .map((_, i) => `$${i + 1}`)
    .join(', ')})`;

export const buildInsertQueryString = (
  table: string,
  row: Row,
  convertToSnakecase: boolean
) => `
  INSERT INTO ${
    convertToSnakecase ? resolveTableSnakeCase(table) : wrapDoubleQuotes(table)
  }
  ${buildInsertColumnString(row, convertToSnakecase)}
  VALUES
  ${buildInsertValueBindingString(row)}
  RETURNING *
`;

export const buildDeleteQueryString = (
  table: string,
  pkName: string,
  keys: Array<string | number>,
  convertToSnakecase: boolean
) => {
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
  DELETE FROM ${
    convertToSnakecase ? resolveTableSnakeCase(table) : wrapDoubleQuotes(table)
  }
  WHERE "${
    convertToSnakecase ? snakeCase(pkName) : pkName
  }" IN (${pkValues.join(', ')})
`;
};

export const findPrimaryKeyName = ({
  fields,
}: Pick<QueryResult, 'fields'>): string => {
  const fieldDef = fields.find((field) => field.columnID === 1);
  if (!fieldDef) {
    throw new Error(
      `No primary key found in result fieldset: ${JSON.stringify(fields)}`
    );
  }
  return fieldDef.name;
};

export const createRowToQueryMapper =
  (table: string, pool: Pool, convertToSnakecase: boolean) =>
  (row: Row): Promise<QueryResult> =>
    pool.query(
      buildInsertQueryString(table, row, convertToSnakecase),
      Object.values(row)
    );
