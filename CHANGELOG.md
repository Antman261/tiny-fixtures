# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/antman261/tiny-fixtures/compare/v0.2.7...v0.3.0) (2024-10-23)


### ⚠ BREAKING CHANGES

* May no longer supports node versions <14

*  Update ts compile target to es2020 ([6ac4703](https://github.com/antman261/tiny-fixtures/commit/6ac4703a2f9eadc53fecd3b3fd67463d6476fba9))

### [0.2.7](https://github.com/antman261/tiny-fixtures/compare/v0.2.6...v0.2.7) (2023-04-07)

### [0.2.6](https://github.com/antman261/tiny-fixtures/compare/v0.2.5...v0.2.6) (2023-04-02)

### [0.2.5](https://github.com/antman261/tiny-fixtures/compare/v0.2.4...v0.2.5) (2023-04-02)


### Features

* allow multiple FKs ([7471cbc](https://github.com/antman261/tiny-fixtures/commit/7471cbc98770c5af4dbfe18a61196f02c7fed4f7))
* allow pg-camelcase'd identifiers ([5316130](https://github.com/antman261/tiny-fixtures/commit/53161304742e50d00699f18fe36210a314bec1bd))
* SetupFixtures returns inserted rows ([de57e32](https://github.com/antman261/tiny-fixtures/commit/de57e32ac4c7b06554d158b1e822a8e879e3c058))


### Bug Fixes

* **identifiers:** support for case sensitive identifiers ([a26ab59](https://github.com/antman261/tiny-fixtures/commit/a26ab594a96b4d7722239dd5f85f0e54c6658386)), closes [#3](https://github.com/antman261/tiny-fixtures/issues/3)
* allow string-like typed key ([bdf60b1](https://github.com/antman261/tiny-fixtures/commit/bdf60b11917ec0cbfa6d173e55c492f06f46c83d))
* guarantee insert order ([d5b396c](https://github.com/antman261/tiny-fixtures/commit/d5b396ca82bb5721fffdbc8b82b97790d2027609))
* make setup/teadown awaitable ([a2ee35d](https://github.com/antman261/tiny-fixtures/commit/a2ee35d9734b4c4de327800d31c74e2d0bab92ba))
* quote identifiers ([1cc7b35](https://github.com/antman261/tiny-fixtures/commit/1cc7b353eaabdf3d7dbe49c505b6c0c9d317d882))

### [0.2.4](https://github.com/antman261/tiny-fixtures/compare/v0.2.3...v0.2.4) (2021-05-23)

### [0.2.3](https://github.com/antman261/tiny-fixtures/compare/v0.2.2...v0.2.3) (2021-05-22)

### [0.2.2](https://github.com/antman261/tiny-fixtures/compare/v0.2.1...v0.2.2) (2021-05-22)

### [0.2.1](https://github.com/antman261/tiny-fixtures/compare/v0.2.0...v0.2.1) (2021-05-21)

## 0.2.0 (2021-05-21)


### ⚠ BREAKING CHANGES

* **query errors:** Some queries that previously would have been created now produce errors

### Features

* **query errors:** add error cases for delete query builder ([e31ad6e](https://github.com/antman261/tiny-fixtures/commit/e31ad6e1e1efc3b20fbb6b216f781617f7fd7feb))
