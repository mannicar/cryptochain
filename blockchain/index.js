const Block = require('./block');
const { cryptoHash } = require('../util'); 
const {REWARD_INPUT, MINING_REWARD} = require('../config');
const Transaction = require('../wallet/transaction');

class Blockchain {

  constructor() {
      this.chain = [Block.genesis()];
  }

  addBlock({data}){
      const newBlock = Block.mineBlock({
          lastBlock: this.chain[this.chain.length - 1], 
          data
        });

        this.chain.push(newBlock);
    };

    replaceChain(chain, onSuccess){
        if (chain.length <= this.chain.length) {
            console.error('Incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain must be valid');
            return;
        }

        if (onSuccess) onSuccess();
        
        console.log('Replacing chain with ', chain);
        this.chain = chain;
    };

    validTransactionData({ chain }){
        for (let i=1; i < chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;

            for(let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    ++rewardTransactionCount;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid Transaction');
                        return false;
                    }
                }
            }
        }
        return true;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) { return false; }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i-1].hash;
            const {timestamp, lastHash, hash, nonce, difficulty, data} = block;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    };

}

module.exports = Blockchain;