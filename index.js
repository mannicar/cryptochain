// Declare variables
const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const {PORT, HOSTNAME} = require('./config');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

// Define endpoints
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

// Initialize server
app.listen(PORT, HOSTNAME, () => {
    console.log(`listening at ${HOSTNAME}:${PORT}`);
});