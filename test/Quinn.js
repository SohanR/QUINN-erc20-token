
const Quinn = artifacts.require('Quinn');

contract('Quinn', (accounts) => {
    let tokenInstance;

    it('allocates the initial supply upon deployment', async () => {
        tokenInstance = await Quinn.deployed();
        let totalSupply = await tokenInstance.totalSupply();
       
        assert.equal(
            totalSupply.toNumber(),
            1000000,
            'sets the total supply to 1000000'
        )
       
    })
})