import { Pool, QueryResult } from 'pg';
declare type Row = Object;
export declare const buildDeleteQueryString: (table: string, pkName: string, keys: Array<string | number>, camelCased: boolean) => string;
export declare const findPrimaryKeyName: ({ fields }: Pick<QueryResult, 'fields'>) => string;
export declare const createRowToQueryMapper: (table: string, pool: Pool, camelCased: boolean) => (row: Row) => Promise<QueryResult>;
export {};
//# sourceMappingURL=query.d.ts.map