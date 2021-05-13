import { Pool } from "pg";
declare type SetupFixtures = () => void;
declare type TeardownFixtures = () => void;
declare type RowHelpers = {
    getRefByKey: (key: string) => () => string | number;
};
declare type TinyFixtures = {
    createFixtures: <T extends object>(table: string, rows: T[], primaryKeyName?: string) => [SetupFixtures, TeardownFixtures, Array<T & RowHelpers>];
};
export declare const tinyFixtures: (pool: Pool) => TinyFixtures;
export {};
//# sourceMappingURL=index.d.ts.map