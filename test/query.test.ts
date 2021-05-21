import { expect } from 'chai';
import { buildDeleteQueryString } from '../src/query';

describe('query functions', function() {
  describe('buildDeleteQueryString', () => {
    const expectedOne = `
  DELETE FROM test
  WHERE test_id IN (1)
`;
    const expectedTwo = `
  DELETE FROM test
  WHERE test_id IN (1, 2, 3)
`;
    it('builds a basic delete query string', () => {
      const actual =  buildDeleteQueryString('test', 'test_id', [1]);
      expect(actual).to.equal(expectedOne);
    });

    it('builds a delete query string with multiple ids', () => {
      const actual =  buildDeleteQueryString('test', 'test_id', [1, 2, 3]);
      expect(actual).to.equal(expectedTwo);
    });

    it('builds a delete query string with string ids', () => {
      const actual =  buildDeleteQueryString('test', 'test_id', ['1', '2', '3']);
      expect(actual).to.equal(expectedTwo);
    });

    it('builds a delete query string with mixed ids', () => {
      const actual =  buildDeleteQueryString('test', 'test_id', ['1', 2, '3']);
      expect(actual).to.equal(expectedTwo);
    });

    it('throws an error if given an empty array', () => {
      const func = () => buildDeleteQueryString('test', 'test_id', []);
      expect(func).to.throw();
    });

    it('throws an error if given an empty pkName', () => {
      const func = () => buildDeleteQueryString('test', '', [1]);
      expect(func).to.throw();
    });

    it('throws an error if given an empty table name', () => {
      const func = () => buildDeleteQueryString('', 'bob', [1]);
      expect(func).to.throw();
    });
  })
});
