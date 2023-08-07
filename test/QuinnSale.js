const Quinn = artifacts.require("Quinn")
const QuinnSale = artifacts.require("QuinnSale")
const mlog = require('mocha-logger');
const common = require('../const')


contract("QuinnSale", (accounts) => {
    
    let saleInstance;
    let tokenInstance;
    let admin = accounts[0];
    let buyer = accounts[1];

    it('initialize the contract with the correct values',async () => {
         // Deploy Quinn contract
         saleInstance = await QuinnSale.deployed();
      

        let address = saleInstance.address;
        assert.notEqual(address, 0x0, 'has contract address');

        let tokenContractAddress = await saleInstance.tokenContract();
        assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');

        let price = await saleInstance.tokenPrice();
        assert.equal(price,common.TOKEN_PRICE, 'token price is correct');
    });
})
