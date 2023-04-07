import { expect } from 'chai';
import { buildDeleteQueryString, buildInsertQueryString } from '../src/query';
import { findPrimaryKeyName } from '../src/query';
import { FieldDef, QueryResult } from 'pg';

describe('query functions', function () {
  describe('buildDeleteQueryString', () => {
    const expectedOne = `
  DELETE FROM "test"
  WHERE "test_id" IN (1)
`;
    const expectedTwo = `
  DELETE FROM "test"
  WHERE "test_id" IN (1, 2, 3)
`;
    const expectedThree = `
  DELETE FROM "test"
  WHERE "test_id" IN ('1', '2', '3')
`;
    const expectedFour = `
  DELETE FROM "test"
  WHERE "test_id" IN ('1', 2, '3')
`;
    it('builds a basic delete query string', () => {
      const actual = buildDeleteQueryString('test', 'test_id', [1], false);
      expect(actual).to.equal(expectedOne);
    });

    it('builds a delete query string with multiple ids', () => {
      const actual = buildDeleteQueryString('test', 'test_id', [1, 2, 3], false);
      expect(actual).to.equal(expectedTwo);
    });

    it('builds a delete query string with string ids', () => {
      const actual = buildDeleteQueryString('test', 'test_id', ['1', '2', '3'], false);
      expect(actual).to.equal(expectedThree);
    });

    it('builds a delete query string with mixed ids', () => {
      const actual = buildDeleteQueryString('test', 'test_id', ['1', 2, '3'], false);
      expect(actual).to.equal(expectedFour);
    });

    it('throws an error if given an empty array', () => {
      const func = () => buildDeleteQueryString('test', 'test_id', [], false);
      expect(func).to.throw();
    });

    it('throws an error if given an empty pkName', () => {
      const func = () => buildDeleteQueryString('test', '', [1], false);
      expect(func).to.throw();
    });

    it('throws an error if given an empty table name', () => {
      const func = () => buildDeleteQueryString('', 'bob', [1], false);
      expect(func).to.throw();
    });

    it('builds a snake_cased delete query string', () => {
      const actual = buildDeleteQueryString('Test', 'testId', [1], true);
      expect(actual).to.equal(expectedOne);
    });
  });
  describe('findPrimaryKeyName', function () {
    const fieldDefTemplate: FieldDef = {
      columnID: 1,
      name: 'id',
      tableID: 1,
      dataTypeID: 25,
      dataTypeSize: 8,
      dataTypeModifier: 0,
      format: '',
    };
    const fieldsBad: Pick<QueryResult, 'fields'> = {
      fields: [{ ...fieldDefTemplate, columnID: 2 }],
    };
    const fieldsGood: Pick<QueryResult, 'fields'> = {
      fields: [
        { ...fieldDefTemplate, name: 'username', columnID: 2 },
        { ...fieldDefTemplate },
      ],
    };
    it('throws if no column with ID 1 exists', () => {
      const func = () => findPrimaryKeyName(fieldsBad);
      expect(func).to.throw('No primary key');
    });
    it('throws if given empty fields array', () => {
      const func = () => findPrimaryKeyName({ fields: [] });
      expect(func).to.throw('No primary key');
    });
    it('returns the field name of column 1', () => {
      expect(findPrimaryKeyName(fieldsGood)).to.equal('id');
    });
  });

  describe('buildInsertQueryString', () => {
    it('returns the insert query with schema', () => {
      const actual = buildInsertQueryString('public."users"', {
        first_name: 'Seth',
        last_name: 'Tran',
      }, false);

      expect(actual).to.equal(`
  INSERT INTO public."users"
  ("first_name", "last_name")
  VALUES
  ($1, $2)
  RETURNING *
`);
    });

    it('returns the insert query without schema', () => {
      const actual = buildInsertQueryString('users', {
        first_name: 'Ant',
        last_name: 'Man',
      }, false);

      expect(actual).to.equal(`
  INSERT INTO "users"
  ("first_name", "last_name")
  VALUES
  ($1, $2)
  RETURNING *
`);
    });

    it('returns the insert query with schema automatically converted to snake_case', () => {
      const actual = buildInsertQueryString('public."superUsers"', {
        first_name: 'God',
        last_name: 'Mode',
      }, true);

      expect(actual).to.equal(`
  INSERT INTO public."super_users"
  ("first_name", "last_name")
  VALUES
  ($1, $2)
  RETURNING *
`);
    });
  });
});
