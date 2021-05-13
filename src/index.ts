import { Pool } from "pg";
import {
    buildDeleteQueryString,
    createRowToQueryMapper,
    findPrimaryKeyName
} from './query';

type SetupFixtures = () => void;
type TeardownFixtures = () => void;
type RowHelpers = {
    /*
        @param key: pass the name of the column in the originating table
        @param idx: pass the index position of the row
     */
    getRefByKey: (key: string) => () => string | number;
}

type TinyFixtures = {
    createFixtures: <T extends object>(table: string, rows: T[], primaryKeyName?: string) => [SetupFixtures, TeardownFixtures, Array<T & RowHelpers>];
}

const createRefGetter = (rows: any[], index: number) =>
  <T extends object>(key: string) =>
    (): string | number => rows[index][key];


export const tinyFixtures = (pool: Pool): TinyFixtures => {
    const createFixtures: TinyFixtures['createFixtures'] = (table, rows, primaryKeyName) => {
        const rowsEnhanced: any[] = [];
        rows.forEach((r, index) => rowsEnhanced.push({
            ...r,
            getRefByKey: createRefGetter(rowsEnhanced, index),
        }));
        let primaryKeys: Array<string> | Array<number> = [];
        let pkName: string;
        const setupFixtures = async () => {
            const rowsResolved = rows.map(row => {
                const unresolvedKey = Object
                  .keys(row)
                  // @ts-ignore
                  .find(k => typeof row[k] === 'function');

                if (unresolvedKey) {
                    // @ts-ignore
                    const resolvedValue = row[unresolvedKey]();
                    return {
                        ...row,
                        [unresolvedKey]: resolvedValue,
                    }
                }
                return row;
            })

            const mapRowToInsertQuery = createRowToQueryMapper(table, pool);
            const pendingInsertQueries = rowsResolved.map(mapRowToInsertQuery);
            // might need to loop here so we can guarantee insert order

            const results = await Promise.all([
              ...pendingInsertQueries
            ]);

            pkName = primaryKeyName || findPrimaryKeyName(results[0]);
            primaryKeys = results.map(({ rows }) => rows[0][pkName]);

            const mixedArr = results.map(({ rows }, i) => ({
                ...rowsEnhanced[i],
                ...rows[0],
            }));

            rowsEnhanced.splice(0, rowsEnhanced.length);
            mixedArr.forEach(r => rowsEnhanced.push(r));

            return results;
        };
        const teardownFixtures = async () => {
            return pool.query(buildDeleteQueryString(table, pkName, primaryKeys));
        };

        return [setupFixtures, teardownFixtures, rowsEnhanced];
    }
    return { createFixtures }
}
