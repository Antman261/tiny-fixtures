import { expect } from 'chai';
import { getUsers } from './db/users';
import { tinyFixtures } from '../src';
import { pool } from './db/conn';

const { createFixtures } = tinyFixtures(pool);

describe('integration test the whole library', () => {
  describe('Basic single table use case', () => {
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
      const users = await getUsers();
      expect(users.length).to.equal(2);
    });
  });

  describe('Two table with join use case', () => {
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
          user_id: users[0].getRefByKey('id'),
          message: 'Foobar did the bar foo good',
        },
        {
          user_id: users[0].getRefByKey('id'),
          message: 'I am a meat popsicle',
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
    it('should have a user with two messages, and one with none', async () => {
      const users = await getUsers();
      expect(users.length).to.equal(2);
      expect(users[0].messages.length).to.equal(2);
      expect(users[1].messages.length).to.equal(0);
    });
  });
});
