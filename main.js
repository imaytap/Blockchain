
const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('e32ec68d70bbe1a2cfbe9504087d0551311fda7c782b98de1eafac71afacb87e');
const myWalletAddress =myKey.getPublic('hex');

let bozkurtCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);

tx1.signTransaction(myKey);

bozkurtCoin.addTransaction(tx1);

console.log('\n Starting miner...');

bozkurtCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of xavier is' , bozkurtCoin.getBalanceOfAddres(myWalletAddress));

bozkurtCoin.chain[1].transactions[0].amount = 1;
console.log('is chain valid?', bozkurtCoin.isChainValid());

// public key 041050dfdc16d80f26496a2aa97bc78e941e2141031106113266e50b76bfdbd57e0d3f069c1670cf317139d78fd905ac48d1826a9639a0a7083ef8f7c364111d6f
