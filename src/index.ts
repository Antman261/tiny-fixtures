import { Pool } from "pg";
import {
    buildDeleteQueryString,
    createRowToQueryMapper,
    findPrimaryKeyName
} from './query';

type SetupFixtures = () => void;
type TeardownFixtures = () => void;
type RowHelpers<T> = {
    getRefByKey: (key: string, idx: number) => (obj: T) => string | number; // this func returns a function tha
}

type TinyFixtures = {
    createFixtures: <T extends object>(table: string, rows: T[], primaryKeyName?: string) => [SetupFixtures, TeardownFixtures, Array<T & RowHelpers<T>>];
}

const createRefGetter = (rows: any[]) =>
  <T extends object>(key: string, index: number) =>
    (obj: T): string | number => {
        console.log('obj:', obj)
        console.log('rows', rows);

        // @ts-ignore
        return rows[index][key];
    };

// ok lets think a minute here... we have access to an object, we know its index position, we want to get its pk id but it hasnt been set yet
// if we pass the ref function an array, it can load that into the context...

export const tinyFixtures = (pool: Pool): TinyFixtures => {
    const createFixtures: TinyFixtures['createFixtures'] = (table, rows, primaryKeyName) => {
        let rowsEnhanced: any[] = [];
        rows.forEach(r => rowsEnhanced.push({
            ...r,
            getRefByKey: createRefGetter(rowsEnhanced),
        }));
        let primaryKeys: Array<string> | Array<number> = [];
        let pkName: string;
        const setupFixtures = async () => {
            // lets do the bad thing to make the tests pass, then figure out how to refactor
            // will need to loop through every row and check for functions, then execute them to resolve their values
            const rowsResolved = rows.map(row => {
                const unresolvedKey = Object
                  .keys(row)
                  // @ts-ignore
                  .find(k => typeof row[k] === 'function');

                if (unresolvedKey) {
                    // @ts-ignore
                    const resolvedValue = row[unresolvedKey](row);
                    return {
                        ...row,
                        [unresolvedKey]: resolvedValue,
                    }
                }
                return row;
            })

            const mapRowToInsertQuery = createRowToQueryMapper(table, pool);
            const pendingInsertQueries = rowsResolved.map(mapRowToInsertQuery);

            const results = await Promise.all([
              ...pendingInsertQueries
            ]);

            pkName = primaryKeyName || findPrimaryKeyName(results[0]);
            primaryKeys = results.map(({ rows }) => rows[0][pkName]);

            // we could do a cheeky mutation and replace the rowsEnhanced with result + enhance
            // rowsEnhanced.splice(0, rowsEnhanced.length);
            const mixedArr = results.map(({ rows }, i) => ({
                ...rowsEnhanced[i],
                ...rows[0],
            }));

            console.log('mixedArr', mixedArr);

            rowsEnhanced.splice(0, rowsEnhanced.length);
            mixedArr.forEach(r => rowsEnhanced.push(r));

            console.log('rowsenhanced', rowsEnhanced)

            return results;
        };
        const teardownFixtures = async () => {
            return pool.query(buildDeleteQueryString(table, pkName, primaryKeys));
        };

        return [setupFixtures, teardownFixtures, rowsEnhanced];
    }
    return { createFixtures }
}
