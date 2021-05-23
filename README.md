# Tiny Fixtures [![tiny-fixtures](https://circleci.com/gh/Antman261/tiny-fixtures.svg?style=svg)](https://app.circleci.com/pipelines/github/Antman261/tiny-fixtures) [![npm monthly downloads](https://img.shields.io/npm/dm/tiny-fixtures.svg?style=flat-square)](https://www.npmjs.com/package/tiny-fixtures) [![current version](https://img.shields.io/npm/v/tiny-fixtures.svg?style=flat-square)](https://www.npmjs.com/package/tiny-fixtures) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

Run `npm i -D tiny-fixtures` to save to your dev dependencies.

## Compatibility

Currently, only tested against Postgres flavoured SQL assuming a node-postgres connection pool.

## Usage

Initialise a fixture manager by providing it with a connection pool. 
TinyFixtures will return an object with a `createFixtures` function.

```ts
import { tinyFixtures } from 'tiny-fixtures';
import { pool } from './db/connection';
import { getUsers } from '/db/users';

const { createFixtures } = tinyFixtures(pool)

describe('my test cases', () => {
    const [setupUserFixtures, teardownUserFixtures] = createFixtures('users', [
        {
            email: 'foo@bar.co',
            username: 'tinyAnt'
        }, {
            email: 'bar@foo.co',
            username: 'antTiny',
        }
    ]);
    beforeEach(async () => {
        await setupUserFixtures();
    });
    afterEach(async () => {
        await teardownUserFixtures();
    });
    it('should have two users in the database', async () => {
        expect((await getUsers()).length).to.equal(2);
    });
})
```

`createFixtures` takes 
* a table name
* an array of objects

Each object in the array is a row to insert. The setup function uses each row object's keys as column names.

In the example above, tiny-fixtures will insert into columns `email` and `username`.

`createFixtures` returns two functions:
* setupFixtures,
* teardownFixtures

Call these functions in your before each and after each hook respectively. Tiny fixtures will then ensure you have clean data for each test. Additionally, it will preserve existing data in the database, improving the local development experience.

To create fixtures across foreign keys use the third value returned
by `createFixtures` to populate the next table, being sure to correctly order your
setup and teardown steps.

```ts
import { tinyFixtures } from 'tiny-fixtures';
import { pool } from './db/connection';
import { getUsers } from '/db/users';

const { createFixtures } = tinyFixtures(pool);

describe('my test cases', () => {
  const [setupUserFixtures, teardownUserFixtures, users] = createFixtures('users', [
    {
      email: 'foo@bar.co',
      username: 'tinyAnt'
    }, {
      email: 'bar@foo.co',
      username: 'antTiny',
    }
  ]);
  const [setupUserMessageFixtures, teardownUserMessageFixtures] = createFixtures(
    'user_messages',
    [{
        user_id: users[0].getRefByKey('id'),
        message: 'Foobar did the bar foo good',
      },
      {
        user_id: users[0].getRefByKey('id'),
        message: 'I am a meat popsicle', 
    }]
  )
  beforeEach(async () => {
    await setupUserFixtures();
    await setupUserMessageFixtures();
  });
  afterEach(async () => {
    await teardownUserMessageFixtures();
    await teardownUserFixtures();
  });
  it('should have a user with two messages, and one with none', async () => {
    const users = await getUsers();
    expect(users.length).to.equal(2);
    expect(users[0].messages.length).to.equal(2);
    expect(users[1].messages.length).to.equal(0);
  });
})
```

Pay attention to the ordering -- following these simple patterns is what keeps tiny-fixtures tiny!

### Explaining `user_id: users[0].getRefByKey('id')`

Because the fixture hasn't been inserted into the database yet, tiny-fixtures doesn't have any serial/sequence values in the row array returned as the 3rd return value. `getRefByKey` takes the column name of the primary key for the parent object in the foreign key, allowing the value to be resolved when the setup step occurs. 

Tiny-fixtures resolves the value at setup by inspecting the row objects you provided for functions. When it finds one, it looks up the result for that column in the original object, and populates its value before continuing the insert.

Tiny-fixtures is then able to create and destroy fixtures across foreign keys for each test run.

### Docs

Full documentation located at [https://www.tiny-fixtures.com/modules.html](https://www.tiny-fixtures.com/modules.html)

## Changelog

See [CHANGELOG.md](https://github.com/Antman261/tiny-fixtures/blob/main/CHANGELOG.md)
