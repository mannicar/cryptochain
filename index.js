// Declare variables
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet')
const TransactionMiner = require('./app/transaction-miner');
const {DEFAULT_PORT, HOSTNAME} = require('./config');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub});

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
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });
    try{ 
        if (transaction){
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ 
                recipient, 
                amount, 
                chain: blockchain.chain
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type:'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({chain: blockchain, address})
    });
});

// Initialize server

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, 
    (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with ', rootChain);
            blockchain.replaceChain(rootChain, true);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, 
        (error, response, body) => {
            if (!error && response.statusCode ===200) {
                const rootTransactionPoolMap = JSON.parse(body);

                console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
                transactionPool.setMap(rootTransactionPoolMap);
            }
        });
};

// Boostrap and deploy
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, HOSTNAME, () => {
    console.log(`listening at ${HOSTNAME}:${PORT}`);
    if (PORT !== DEFAULT_PORT) {syncWithRootState();};
});