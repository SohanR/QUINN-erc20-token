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

    it("facilitates token buying", async () => {
        tokenInstance = await Quinn.deployed();
        saleInstance = await QuinnSale.deployed();

         
        // give ICO_SUPPLY_PERCENT token to sale contract
        await tokenInstance.transfer(
          saleInstance.address,
          common.TOTAL_SUPPLY * common.ICO_SUPPLY_PERCENT,
          { from: admin }
        );
    
        let numberOfTokens = 10;
    
        let receipt = await saleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * common.TOKEN_PRICE,
        });
    
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(receipt.logs[0].event, "Sell", "should be Sell event");
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account that purchased the tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
    
        let amount = await saleInstance.tokensSold();
    
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments the number of tokens sold"
        );
    
        let buyerBalance = await tokenInstance.balanceOf(buyer);
        let tokenSaleBalance = await tokenInstance.balanceOf(
          saleInstance.address
        );
        assert.equal(buyerBalance.toNumber(), numberOfTokens);
        assert.equal(
            tokenSaleBalance.toNumber(),
          common.TOTAL_SUPPLY * common.ICO_SUPPLY_PERCENT - numberOfTokens
        );
    
        //try to buy tokens different from the ether value
        try {
          await saleInstance.buyTokens(numberOfTokens, {
            from: buyer,
            value: 1,
          });
          assert(false);
        } catch (error) {
          mlog.log("********error messages: \n" + error.message);
          assert(
            error.message.indexOf("revert") >= 0,
            "msg.value must equal number of tokens in wei"
          );
        }
    
        //try to buy tokens 1 more than the sale contrace have
        try {
          await saleInstance.buyTokens(
            8000000, 
            {
              from: buyer,
              value: numberOfTokens * common.TOKEN_PRICE,
            }
          );
          assert(false);
        } catch (error) {
          mlog.log("********error messages: \n" + error.message);
          assert(
            error.message.indexOf("revert") >= 0,
            "cannot purchase more tokens than available"
          );
        }
    });
})
