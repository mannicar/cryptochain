const EC = require('elliptic').ec;

// Elliptic cryptography
const ec = new EC('secp256k1');

module.exports = {ec};