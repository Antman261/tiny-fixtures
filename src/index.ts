import { Pool } from "pg";
import {
    buildDeleteQueryString,
    createRowToQueryMapper,
    findPrimaryKeyName
} from './query';

type SetupFixtures = () => void;
type TeardownFixtures = () => void;
type RowHelpers<T> = {
    getRefByKey: (key: keyof T) => (obj: T) => any; // this func returns a function tha
}

type TinyFixtures = {
    createFixtures: <T extends object>(table: string, rows: T[], primaryKeyName?: string) => [SetupFixtures, TeardownFixtures, Array<T & RowHelpers<T>>];
}

const getRefByKey = <T extends object>(key: keyof T) => (obj: T): any => obj[key];

export const tinyFixtures = (pool: Pool): TinyFixtures => {
    const createFixtures: TinyFixtures['createFixtures'] = (table, rows, primaryKeyName) => {
        const rowsEnhanced = rows.map(r => ({
            ...r,
            getRefByKey
        }));
        let primaryKeys: Array<string> | Array<number> = [];
        let pkName: string;
        const setupFixtures = async () => {
            // lets do the bad thing to make the tests pass, then figure out how to refactor
            // will need to loop through every row and check for functions, then execute them to resolve their values
            const mapRowToInsertQuery = createRowToQueryMapper(table, pool);
            const pendingInsertQueries = rows.map(mapRowToInsertQuery);

            const results = await Promise.all([
              ...pendingInsertQueries
            ]);

            pkName = primaryKeyName || findPrimaryKeyName(results[0]);
            primaryKeys = results.map(({ rows }) => rows[0][pkName]);

            return results;
        };
        const teardownFixtures = async () => {
            return pool.query(buildDeleteQueryString(table, pkName, primaryKeys));
        };

        return [setupFixtures, teardownFixtures, rowsEnhanced];
    }
    return { createFixtures }
}
