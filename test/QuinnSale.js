const Quinn = artifacts.require("Quinn")
const QuinnSale = artifacts.require("QuinnSale")
const mlog = require('mocha-logger');
const common = require('../const')


contract("QuinnSale", (accounts) => {
    
  let saleInstance;
  let tokenInstance;
  let admin = accounts[0];
  let buyer = accounts[1];
  let tokenPrice = common.TOKEN_PRICE
  var tokensAvailable = common.TOTAL_SUPPLY * common.ICO_SUPPLY_PERCENT;

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

  it('facilitates token buying', function() {
    return Quinn.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return QuinnSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
    }).then(function(receipt) {
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      // Try to buy tokens different from the ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
    });
  });

});