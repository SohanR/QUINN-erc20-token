
const Quinn = artifacts.require('Quinn');
const common = require('../const')
const mlog = require('mocha-logger');

contract('Quinn', (accounts) => {
    let tokenInstance;

    it('initializes the contract with the correct values', async () => {
        tokenInstance = await Quinn.deployed();
        assert.equal(
            await tokenInstance.name(),
            'Quinn',
            'has the correct name'
        );
        assert.equal(
            await tokenInstance.symbol(),
            'QNN',
            'has the correct symbol'
        );
        assert.equal(
            await tokenInstance.standard(),
            'QNN v1.0',
            'has the correct standard'
        )
    })

    // checking the total coin supply and balance of account
    it('allocates the initial supply upon deployment', async () => {
        tokenInstance = await Quinn.deployed();
        let totalSupply = await tokenInstance.totalSupply();
       
        assert.equal(
            totalSupply.toNumber(),
            common.TOTAL_SUPPLY,
            'sets the total supply to ' + common.TOTAL_SUPPLY
        );

        let adminBalance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(
          adminBalance.toNumber(),
          common.TOTAL_SUPPLY,
          'it allocates the initial supply to the admin account'
        )
       
    })

    it('transfer coin ownership',async () => {
        tokenInstance = await Quinn.deployed();

        try {
            // call() inspect, dont create any transactions
            await tokenInstance.transfer.call(accounts[1], 9999999999);
            assert(false)
        } catch (error) {
            mlog.log('\n' + error.message)
            assert(
                error.message.indexOf('revert') >=0 ,
                'error message must contain revert' 
            )
        }

        const DEDUCTS_AMOUNT = 250000;

        let returnValue = await tokenInstance.transfer.call(
            accounts[1],
            DEDUCTS_AMOUNT,
            {
                from:accounts[0]
            }
        )

        assert.equal(returnValue, true, 'it returns true');

        let receipt = await tokenInstance.transfer(accounts[1],DEDUCTS_AMOUNT,{from:accounts[0]});

        assert.equal(receipt.logs.length, 1, 'triggers one event');

        assert.equal(receipt.logs[0].event, 'Transfer', 'should be transfer event');

        assert.equal(
            receipt.logs[0].args._from,
            accounts[0],
            'logs the account the tokens are transferred from'
          );

          assert.equal(
            receipt.logs[0].args._to,
            accounts[1],
            'logs the account the tokens are transferred to'
          );

          assert.equal(
            receipt.logs[0].args._value,
            DEDUCTS_AMOUNT,
            'logs the transfer amount'
          );

          let balance1AfterTransfer = await tokenInstance.balanceOf(accounts[1]);
          assert.equal(
            balance1AfterTransfer.toNumber(),
            DEDUCTS_AMOUNT,
            'adds the amount to the receiving account'
          );
          let balance0AfterTransfer = await tokenInstance.balanceOf(accounts[0]);
          assert.equal(
            balance0AfterTransfer.toNumber(),
            common.TOTAL_SUPPLY - DEDUCTS_AMOUNT,
            'deducts the amount from the sending account'
          );
    });

    it('approve tokens for delegate transfer',async () => {
        const APPROVE_AMOUNT = 100;

        tokenInstance = await Quinn.deployed(); 

        let result = await tokenInstance.approve.call(
            accounts[0],
            APPROVE_AMOUNT
        );

        assert.equal(result, true, 'it returns true');

        let receipt = await tokenInstance.approve(accounts[1], APPROVE_AMOUNT, {from: accounts[0]});


        assert.equal(receipt.logs.length, 1, 'triggers one event');

        assert.equal(receipt.logs[0].event, 'Approval', 'should be approval event');

        assert.equal(
            receipt.logs[0].args._owner,
            accounts[0],
            'logs the account the tokens are transferred from'
          );

          assert.equal(
            receipt.logs[0].args._spender,
            accounts[1],
            'logs the account the tokens are transferred to'
          );

          assert.equal(
            receipt.logs[0].args._value,
            APPROVE_AMOUNT,
            'logs the transfer amount'
          );

          let allowance = await tokenInstance.allowance(accounts[0],accounts[1]);

          assert.equal(
            allowance.toNumber(),
            APPROVE_AMOUNT,
            'stores the allowance for delegate transfer'
          );

    });
    
    
})