tiny-fixtures / [Exports](modules.md)

# Tiny Fixtures

## Installation

Run `npm i -D tiny-fixtures` to save to your dev dependencies.

## Compatibility

Currently, only tested against Postgres flavoured SQL and assumes a node-postgres pool

## Usage

Start by initialising a fixture manager with a connection. 
This will return an object containing a `createFixtures` function.

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

`createFixtures` takes a table name as its first arg, and an array of objects
where each object is a row to insert, where the keys are columns,
and the values are the value for that column in that row.

It will then return two functions, one to setup the fixtures, and one to tear them down.
Simply call each of these functions in your before each and after each hooks and voila,
you've got clean test data for each test, and it won't interfere with your existing data.

If you need to create fixtures across foreign keys then use the third value returned
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

**_Whats up with `user_id: users[0].getRefByKey('id')` ?_**

Since the fixture hasn't been inserted into the database yet, we don't have any serial/sequence values yet. This function takes the column name of the primary key for the parent object in the foreign key, allowing the value to be resolved when the setup step occurs. 

How? Well when the setup step runs for the child table, it sees the output of this function as a flag, looks up the result for that column in the original object, and populates its value before continuing the insert.

### Docs

Full documentation located at https://antman261.github.io/tiny-fixtures
