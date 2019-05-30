const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain;
    
    beforeEach(() => {
        blockchain =  new Blockchain();
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'fooBar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain[0] = {data: 'fake-genesis'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain does start with the genesis block and has multiple blocks', () => {
            beforeEach(()=>{
                blockchain.addBlock({data: 'Cat'});
                blockchain.addBlock({data: 'Dog'});
                blockchain.addBlock({data: 'Horse'});
            });
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });

            });
            describe('and one of the blocks contains an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[1].data = 'bad-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });

            });
            describe('and the chain does not cointain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});