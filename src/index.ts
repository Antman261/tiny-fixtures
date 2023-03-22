import { Pool, QueryResult } from 'pg';
import {
  buildDeleteQueryString,
  createRowToQueryMapper,
  findPrimaryKeyName,
} from './query';

/**
 * Call this function inside your `before` or `beforeEach` step to insert the specified fixtures
 */
export type SetupFixtures<T> = () => Promise<QueryResult<T>[]>;

/**
 * Call this function inside your `after` or `afterEach` step to delete the specified fixtures. This will only delete the data inserted for this fixture, so any other test data remains untouched.
 */
export type TeardownFixtures = () => void;

/**
 * When the createFixtures function returns an array of the rows you've chosen to insert with test data, they are extended with these row helpers.
 */
export type RowHelpers = {
  /**
     * Using this function tells tiny-fixtures to get a value from this fixture after it has been inserted in the database, rather than the test data provided by you.
     *
     * This is useful for cases such as accessing a primary key to create a join, or retrieving a default value, such as the result of `DEFAULT NOW()`
     *
     * You only need to use this function to tell tiny-fixtures to retrieve this column at insert. When your tests are running, they will have access to the resulting insert if needed, as tiny-fixtures updates the row array on the fly.
        @param key The name of the column to retrieve.
        @returns  A function that can be executed later to retrieve the value
     */
  getRefByKey: (key: string) => () => string | number;
};

/**
 *  This array contents changes depending whether tests are being prepared or running
 *
 *  ## Preparation
 *  At this point the data in this array is simply the data you passed to `createFixtures`, extended with `RowHelpers`. Since the inserts only occur in the `before` or `beforeEach` step, it is impossible to have the result of the insert before it has occurred.
 *
 *  ## Running tests
 *  Inside your `it` statement, after the `before` or `beforeEach` step has occurred, this array is now populated with the data returned by the database. So any `SERIAL` or `DEFAULT` columns will be accessible here.
 */
export type ResultArray<T> = Array<T & RowHelpers>;

/**
 * Use this function to create a set of fixtures for a particular table in the database.
 *
 * @param table  The name of the table to insert test data into.
 * @param rows  An array of objects containing test data. Each object is a row where keys are column names.
 * @param primaryKeyName  Optional name of the primary key column. If not provided, it is assumed that the first column is the primary key. Tiny-fixtures does not support composite primary keys.
 *  @typeParam T The type of the objects representing each row.
 *  @returns - An array containing setup and teardown functions, plus ResultArray
 */
export type CreateFixtures = <T extends object>(
  table: string,
  rows: T[],
  primaryKeyName?: string
) => [SetupFixtures<T>, TeardownFixtures, ResultArray<T>];

/**
 * Contains the createFixtures function, with the pool in its closure.
 */
export type TinyFixtures = {
  createFixtures: CreateFixtures;
};

const createRefGetter =
  (rows: any[], index: number) =>
  <T extends object>(key: string) =>
  (): string | number =>
    rows[index][key];

/**
 *
 * @param pool A node postgres pool for tiny fixtures to connect with.
 */
export const tinyFixtures = (pool: Pool): TinyFixtures => {
  const createFixtures: TinyFixtures['createFixtures'] = (
    table,
    rows,
    primaryKeyName
  ) => {
    const rowsEnhanced: any[] = [];
    rows.forEach((r, index) =>
      rowsEnhanced.push({
        ...r,
        getRefByKey: createRefGetter(rowsEnhanced, index),
      })
    );
    let primaryKeys: Array<string> | Array<number> = [];
    let pkName: string;
    const setupFixtures = async () => {
      const rowsResolved = rows.map((row) => {
        const unresolvedKey = Object.keys(row)
          // @ts-ignore
          .find((k) => typeof row[k] === 'function');

        if (unresolvedKey) {
          // @ts-ignore
          const resolvedValue = row[unresolvedKey]();
          return {
            ...row,
            [unresolvedKey]: resolvedValue,
          };
        }
        return row;
      });

      const mapRowToInsertQuery = createRowToQueryMapper(table, pool);
      // might need to loop here so we can guarantee insert order
      const results:QueryResult<any>[] = [];
      for (const row of rowsResolved) {
        const result = await mapRowToInsertQuery(row);
        results.push(result)
      }

      pkName = primaryKeyName || findPrimaryKeyName(results[0]);
      primaryKeys = results.map(({ rows }) => rows[0][pkName]);

      const mixedArr = results.map(({ rows }, i) => ({
        ...rowsEnhanced[i],
        ...rows[0],
      }));

      rowsEnhanced.splice(0, rowsEnhanced.length);
      mixedArr.forEach((r) => rowsEnhanced.push(r));

      return results;
    };
    const teardownFixtures = async () => {
      return pool.query(buildDeleteQueryString(table, pkName, primaryKeys));
    };

    return [setupFixtures, teardownFixtures, rowsEnhanced];
  };
  return { createFixtures };
};
