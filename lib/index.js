"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tinyFixtures = void 0;
const query_1 = require("./query");
const createRefGetter = (rows, index) => (key) => () => rows[index][key];
const defaultOpts = {
    convertToSnakecase: false,
};
/**
 * @param pool A node postgres pool for tiny fixtures to connect with.
 * @param { convertToSnakecase: boolean = false } options
 */
const tinyFixtures = (pool, { convertToSnakecase } = defaultOpts) => {
    const createFixtures = (table, rows, primaryKeyName) => {
        const rowsEnhanced = [];
        rows.forEach((r, index) => rowsEnhanced.push({
            ...r,
            getRefByKey: createRefGetter(rowsEnhanced, index),
        }));
        let primaryKeys = [];
        let pkName;
        const setupFixtures = async () => {
            const rowsResolved = rows.map((row) => Object.entries(row).reduce((prev, [k, v]) => {
                const val = typeof v === 'function' ? v() : v;
                return { ...prev, [k]: val };
            }, {}));
            const mapRowToInsertQuery = query_1.createRowToQueryMapper(table, pool, convertToSnakecase);
            // use for loop with await to guarantee insert order
            const results = [];
            for (const row of rowsResolved) {
                const result = await mapRowToInsertQuery(row);
                results.push(result);
            }
            pkName = primaryKeyName || query_1.findPrimaryKeyName(results[0]);
            primaryKeys = results.map(({ rows }) => rows[0][pkName]);
            const mixedArr = results.map(({ rows }, i) => ({
                ...rowsEnhanced[i],
                ...rows[0],
            }));
            rowsEnhanced.splice(0, rowsEnhanced.length);
            mixedArr.forEach((r) => rowsEnhanced.push(r));
            return results.map(({ rows }) => rows[0]);
        };
        const teardownFixtures = async () => {
            await pool.query(query_1.buildDeleteQueryString(table, pkName, primaryKeys, convertToSnakecase));
        };
        return [setupFixtures, teardownFixtures, rowsEnhanced];
    };
    return { createFixtures };
};
exports.tinyFixtures = tinyFixtures;
