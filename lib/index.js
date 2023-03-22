"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tinyFixtures = void 0;
var query_1 = require("./query");
var createRefGetter = function (rows, index) {
    return function (key) {
        return function () {
            return rows[index][key];
        };
    };
};
/**
 *
 * @param pool A node postgres pool for tiny fixtures to connect with.
 */
var tinyFixtures = function (pool) {
    var createFixtures = function (table, rows, primaryKeyName) {
        var rowsEnhanced = [];
        rows.forEach(function (r, index) {
            return rowsEnhanced.push(__assign(__assign({}, r), { getRefByKey: createRefGetter(rowsEnhanced, index) }));
        });
        var primaryKeys = [];
        var pkName;
        var setupFixtures = function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowsResolved, mapRowToInsertQuery, results, _i, rowsResolved_1, row, result, mixedArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowsResolved = rows.map(function (row) {
                            return Object.entries(row).reduce(function (prev, _a) {
                                var _b;
                                var k = _a[0], v = _a[1];
                                var val = typeof v === 'function' ? v() : v;
                                return __assign(__assign({}, prev), (_b = {}, _b[k] = val, _b));
                            }, {});
                        });
                        mapRowToInsertQuery = query_1.createRowToQueryMapper(table, pool);
                        results = [];
                        _i = 0, rowsResolved_1 = rowsResolved;
                        _a.label = 1;
                    case 1:
                        if (!(_i < rowsResolved_1.length)) return [3 /*break*/, 4];
                        row = rowsResolved_1[_i];
                        return [4 /*yield*/, mapRowToInsertQuery(row)];
                    case 2:
                        result = _a.sent();
                        results.push(result);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        pkName = primaryKeyName || query_1.findPrimaryKeyName(results[0]);
                        primaryKeys = results.map(function (_a) {
                            var rows = _a.rows;
                            return rows[0][pkName];
                        });
                        mixedArr = results.map(function (_a, i) {
                            var rows = _a.rows;
                            return (__assign(__assign({}, rowsEnhanced[i]), rows[0]));
                        });
                        rowsEnhanced.splice(0, rowsEnhanced.length);
                        mixedArr.forEach(function (r) { return rowsEnhanced.push(r); });
                        return [2 /*return*/, results];
                }
            });
        }); };
        var teardownFixtures = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, pool.query(query_1.buildDeleteQueryString(table, pkName, primaryKeys))];
            });
        }); };
        return [setupFixtures, teardownFixtures, rowsEnhanced];
    };
    return { createFixtures: createFixtures };
};
exports.tinyFixtures = tinyFixtures;
