import { expect } from 'chai';
import { getUsers } from './db/users';
import { tinyFixtures } from '../src';
import { pool } from './db/conn';

const { createFixtures } = tinyFixtures(pool);

describe('integration test the whole library', () => {
  it('sets up users', () => {
    describe('lets do whats on the tin', () => {
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
  })
});
