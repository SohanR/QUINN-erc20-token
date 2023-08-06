
const Quinn = artifacts.require('Quinn');
const common = require('../const')

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
            'QN',
            'has the correct symbol'
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
})