import { Pool, QueryResult } from 'pg';
declare type Row = Object;
export declare const buildDeleteQueryString: (table: string, pkName: string, keys: Array<string | number>) => string;
export declare const findPrimaryKeyName: ({ fields }: QueryResult) => string;
export declare const createRowToQueryMapper: (table: string, pool: Pool) => (row: Row) => Promise<QueryResult>;
export {};
//# sourceMappingURL=query.d.ts.map