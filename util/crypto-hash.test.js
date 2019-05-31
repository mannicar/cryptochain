const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  const foo_hash = "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae";

  it('generates an SHA-256 hashed output', () => {
      expect(cryptoHash('foo')).toEqual(foo_hash);
  });

  it('produces the same has with the same input arguments regardless of order', () => {
      expect(cryptoHash('one', 'two', 'three'))
      .toEqual(cryptoHash('three', 'one', 'two'));
  });
});