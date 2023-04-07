import { Pool, QueryResult } from 'pg';
declare type Row = Record<string, any>;
export declare const buildInsertQueryString: (table: string, row: Row, convertToSnakecase: boolean) => string;
export declare const buildDeleteQueryString: (table: string, pkName: string, keys: Array<string | number>, convertToSnakecase: boolean) => string;
export declare const findPrimaryKeyName: ({ fields, }: Pick<QueryResult, 'fields'>) => string;
export declare const createRowToQueryMapper: (table: string, pool: Pool, convertToSnakecase: boolean) => (row: Row) => Promise<QueryResult>;
export {};
//# sourceMappingURL=query.d.ts.map