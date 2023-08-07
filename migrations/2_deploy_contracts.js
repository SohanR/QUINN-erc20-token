const Quinn = artifacts.require('Quinn');
const QuinnSale = artifacts.require('QuinnSale');

const common = require('../const');

module.exports = (deployer) => {
    deployer.deploy(Quinn, common.TOTAL_SUPPLY);
    deployer.deploy(QuinnSale, Quinn.address, common.TOKEN_PRICE );
}