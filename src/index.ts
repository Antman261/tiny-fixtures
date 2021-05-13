import { Pool } from "pg";
import { buildDeleteQueryString, buildInsertQueryString } from './query';

type SetupFixtures = () => void;
type TeardownFixtures = () => void;
type RowHelpers<T> = {
    getRefByKey: (key: keyof T) => (obj: T) => any; // this func returns a function tha
}

type TinyFixtures = {
    createFixtures: <T extends object>(table: string, rows: T[]) => [SetupFixtures, TeardownFixtures, Array<T & RowHelpers<T>>];
}

const getRefByKey = <T extends object>(key: keyof T) => (obj: T): any => obj[key];

export const tinyFixtures = (pool: Pool): TinyFixtures => {
    const createFixtures: TinyFixtures['createFixtures'] = (table, rows) => {
        const rowsEnhanced = rows.map(r => ({
            ...r,
            getRefByKey
        }));
        const primaryKeys: Array<string> | Array<number> = [];
        let primaryKeyName = '';
        const setupFixtures = async () => {
            // lets do the bad thing to make the tests pass, then figure out how to refactor
            // will need to loop through every row and check for functions, then execute them to resolve their values
            const queryString = buildInsertQueryString(table, rows[0]);
            const results = await Promise.all([...rows.map(row => pool.query(queryString, Object.values(row)))]);
            const primaryKeyFieldDef = results[0].fields.find(field => field.columnID === 1);
            if (!primaryKeyFieldDef) {
                throw new Error(`No primary key found in result fieldset: ${JSON.stringify(results[0].fields)}`);
            }
            const { name: pkName } = primaryKeyFieldDef;
            primaryKeyName = pkName;
            // @ts-ignore
            results.forEach(result => primaryKeys.push(result.rows[0][pkName]));
            return results;
        };
        const teardownFixtures = async () => {
            return pool.query(buildDeleteQueryString(table, primaryKeyName, primaryKeys));
        };

        return [setupFixtures, teardownFixtures, rowsEnhanced];
    }
    return { createFixtures }
}
