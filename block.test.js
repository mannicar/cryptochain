const Block = require('./block');
const {GENESIS_DATA} = require('./config');

describe('Block', () => {
  const timestamp = 'a-date';
  const lastHash = 'foo-hash';
  const hash = 'bar-hash' ;
  const data = ['blockchain', 'data'];
  // Remember shorthand form
  const block = new Block({
      timestamp: timestamp,
      lastHash: lastHash,
      hash: hash,
      data: data
  });

  it('Has a timestamp, lastHash, hash, and data property', () => {
    // Good practice means you would only have one expect statement per test
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('genesis()', () => {
      const genesisBlock = Block.genesis();

      it('returns a Block instance', () => {
        expect(genesisBlock instanceof Block).toBe(true);
    });

    it ('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});