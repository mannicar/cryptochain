const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000; // set in milliseconds - 1s.

const DEFAULT_PORT = 3000
const HOSTNAME = 'localhost'

const GENESIS_DATA = {
    timestamp:1,
    lastHash:'-----',
    hash:'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

module.exports = { 
    GENESIS_DATA, 
    MINE_RATE, 
    DEFAULT_PORT, 
    HOSTNAME, 
    STARTING_BALANCE 
};