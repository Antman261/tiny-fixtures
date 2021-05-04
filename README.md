# Tiny Fixtures

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
        expect((await getUsers).length).to.equal(2);
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

const { createFixtures } = tinyFixtures(pool)

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
        [
            {
                userId: users[0],
                message: 'Foobar did the bar foo good',
            }
        ]
    )
    beforeEach(async () => {
        await setupUserFixtures();
        await setupUserMessageFixtures();
    });
    afterEach(async () => {
        await teardownUserMessageFixtures();
        await teardownUserFixtures();
    });
    it('should have two users in the database', async () => {
        expect((await getUsers).length).to.equal(2);
    });
})
```

Pay attention to the ordering -- following these simple patterns is what keeps tiny-fixtures tiny!
