// Declare variables
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet')
const {DEFAULT_PORT, HOSTNAME} = require('./config');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain});

const ROOT_NODE_ADDRESS = `http://${HOSTNAME}:${DEFAULT_PORT}`

app.use(bodyParser.json());

// Define endpoints
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;
    blockchain.addBlock({ data });

    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    const transaction = wallet.createTransaction({ recipient, amount });

    transactionPool.setTransaction(transaction);

    console.log('transactionPool', transactionPool);

    res.json({ transaction });
});

// Initialize server

const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, 
    (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with ', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, HOSTNAME, () => {
    console.log(`listening at ${HOSTNAME}:${PORT}`);
    if (PORT !== DEFAULT_PORT) {syncChains();};
});