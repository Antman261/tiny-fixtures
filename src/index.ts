import {Pool} from "pg";

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
        const setupFixtures = () => {

        };
        const teardownFixtures = () => {

        };

        return [setupFixtures, teardownFixtures, rowsEnhanced];
    }
    return { createFixtures }
}
