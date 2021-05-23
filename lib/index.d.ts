import { Pool } from 'pg';
/**
 * Call this function inside your `before` or `beforeEach` step to insert the specified fixtures
 */
export declare type SetupFixtures = () => void;
/**
 * Call this function inside your `after` or `afterEach` step to delete the specified fixtures. This will only delete the data inserted for this fixture, so any other test data remains untouched.
 */
export declare type TeardownFixtures = () => void;
/**
 * When the createFixtures function returns an array of the rows you've chosen to insert with test data, they are extended with these row helpers.
 */
export declare type RowHelpers = {
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
export declare type ResultArray<T> = Array<T & RowHelpers>;
/**
 * Use this function to create a set of fixtures for a particular table in the database.
 *
 * @param table  The name of the table to insert test data into.
 * @param rows  An array of objects containing test data. Each object is a row where keys are column names.
 * @param primaryKeyName  Optional name of the primary key column. If not provided, it is assumed that the first column is the primary key. Tiny-fixtures does not support composite primary keys.
 *  @typeParam T The type of the objects representing each row.
 *  @returns - An array containing setup and teardown functions, plus ResultArray
 */
export declare type CreateFixtures = <T extends object>(table: string, rows: T[], primaryKeyName?: string) => [SetupFixtures, TeardownFixtures, ResultArray<T>];
/**
 * Contains the createFixtures function, with the pool in its closure.
 */
export declare type TinyFixtures = {
    createFixtures: CreateFixtures;
};
/**
 *
 * @param pool A node postgres pool for tiny fixtures to connect with.
 */
export declare const tinyFixtures: (pool: Pool) => TinyFixtures;
//# sourceMappingURL=index.d.ts.map