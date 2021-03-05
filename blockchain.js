const { mode } = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddres, amount){
        this.fromAddress = fromAddress;
        this.toAddres = toAddres;
        this.amount = amount ;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddres + this.amount),toString();
    }
    signTransaction(signinKey){
        if(signinKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You Cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signinKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex')
    }
    isVaild(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor( timestamp, transactions, previousHash = ''){
        
        this.timestamp =timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        this.hash = this.calculateHash();
        
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash )
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isVaild()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100 ;
    }

    createGenesisBlock(){
        return new Block(0 , "20/02/2021", "Genesis block" , "0");
    }
    
    getLatesBlock(){
        return this.chain[this.chain.length - 1];

    }

    minePendingTransactions(miningRewardAddres){
        let block =new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block başarıyla kazıldı")
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddres, this.miningReward)
        ]
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddres){
            throw new Error('Transaction must  include from and to address');
        }
        if(!transaction.isVaild()){
            throw new Error('Canot add invalid transaction to chain');
        }
        
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddres(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){

                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddres === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatesBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Transaction =Transaction;