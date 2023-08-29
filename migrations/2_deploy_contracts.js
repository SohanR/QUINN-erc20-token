const Quinn = artifacts.require('Quinn');
const QuinnSale = artifacts.require('QuinnSale');

const common = require('../const');

// module.exports = (deployer) => {
//     deployer.deploy(Quinn, common.TOTAL_SUPPLY);
//     deployer.deploy(QuinnSale, Quinn.address, common.TOKEN_PRICE );
// }

module.exports = async (deployer) => {
    await deployer.deploy(Quinn, common.TOTAL_SUPPLY);
    const quinnInstance = await Quinn.deployed(); 
    await deployer.deploy(QuinnSale, quinnInstance.address, common.TOKEN_PRICE );
};