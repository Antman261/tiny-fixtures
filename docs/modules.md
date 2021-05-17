[tiny-fixtures](README.md) / Exports

# tiny-fixtures

## Table of contents

### Type aliases

- [CreateFixtures](modules.md#createfixtures)
- [ResultArray](modules.md#resultarray)
- [RowHelpers](modules.md#rowhelpers)
- [SetupFixtures](modules.md#setupfixtures)
- [TeardownFixtures](modules.md#teardownfixtures)
- [TinyFixtures](modules.md#tinyfixtures)

### Functions

- [tinyFixtures](modules.md#tinyfixtures)

## Type aliases

### CreateFixtures

Ƭ **CreateFixtures**: <T\>(`table`: *string*, `rows`: T[], `primaryKeyName?`: *string*) => [[*SetupFixtures*](modules.md#setupfixtures), [*TeardownFixtures*](modules.md#teardownfixtures), [*ResultArray*](modules.md#resultarray)<T\>]

Use this function to create a set of fixtures for a particular table in the database.

#### Type declaration

▸ <T\>(`table`: *string*, `rows`: T[], `primaryKeyName?`: *string*): [[*SetupFixtures*](modules.md#setupfixtures), [*TeardownFixtures*](modules.md#teardownfixtures), [*ResultArray*](modules.md#resultarray)<T\>]

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | *object* | The type of the objects representing each row. |

#### Parameters

| Name | Type | Description
| :------ | :------ | :------ |
| `table` | *string* | The name of the table to insert test data into. |
| `rows` | T[] | An array of objects containing test data. Each object is a row where keys are column names. | 
| `primaryKeyName?` | *string* | Optional name of the primary key column. If not provided, it is assumed that the first column is the primary key. Tiny-fixtures does not support composite primary keys. |

**Returns:** [[*SetupFixtures*](modules.md#setupfixtures), [*TeardownFixtures*](modules.md#teardownfixtures), [*ResultArray*](modules.md#resultarray)<T\>]

Defined in: [index.ts:55](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L55)

___

### ResultArray

Ƭ **ResultArray**<T\>: T & [*RowHelpers*](modules.md#rowhelpers)[]

 This array contents changes depending upon whether tests are being prepared or running.

 ## Preparation
 At this point the data in this array is simply the data you passed to `createFixtures`, extended with `RowHelpers`. Since the inserts only occur in the `before` or `beforeEach` step, it is impossible to have the result of the insert before it has occurred.

 ## Running tests
 Inside your `it` statement, after the `before` or `beforeEach` step has occurred, this array is now populated with the data returned by the database. So any `SERIAL` or `DEFAULT` columns will be accessible here.

#### Type parameters

| Name |
| :------ |
| `T` |

Defined in: [index.ts:44](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L44)

___

### RowHelpers

Ƭ **RowHelpers**: *object*

When the createFixtures function returns an array of the rows you've chosen to insert with test data, they are extended with these row helpers.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `getRefByKey` | (`key`: *string*) => () => *string* \| *number* | Use this function to tell tiny-fixtures to get a value from this fixture after it has been inserted in the database, rather than the test data provided by you.  This is useful for cases such as accessing a primary key to create a join, or retrieving a default value, such as the result of `DEFAULT NOW()`  You only need to use this function to tell tiny-fixtures to retrieve this column at insert. When your tests are running, they will have access to the resulting insert if needed, as tiny-fixtures updates the result array on the fly.  **`param`** The name of the column to retrieve.  **`returns`** A function that can be executed later to retrieve the value |

Defined in: [index.ts:21](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L21)

___

### SetupFixtures

Ƭ **SetupFixtures**: () => *void*

Call this function inside your `before` or `beforeEach` step to insert the specified fixtures

#### Type declaration

▸ (): *void*

**Returns:** *void*

Defined in: [index.ts:11](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L11)

___

### TeardownFixtures

Ƭ **TeardownFixtures**: () => *void*

Call this function inside your `after` or `afterEach` step to delete the specified fixtures. This will only delete the data inserted for this fixture, so any other test data remains untouched.

#### Type declaration

▸ (): *void*

**Returns:** *void*

Defined in: [index.ts:16](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L16)

___

### TinyFixtures

Ƭ **TinyFixtures**: *object*

Contains the createFixtures function, with the pool in its closure.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createFixtures` | [*CreateFixtures*](modules.md#createfixtures) |

Defined in: [index.ts:60](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L60)

## Functions

### tinyFixtures

▸ `Const` **tinyFixtures**(`pool`: *Pool*): [*TinyFixtures*](modules.md#tinyfixtures)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pool` | *Pool* | A node postgres pool for tiny fixtures to connect with. |

**Returns:** [*TinyFixtures*](modules.md#tinyfixtures)

Defined in: [index.ts:73](https://github.com/Antman261/tiny-fixtures/blob/ef9e542/src/index.ts#L73)