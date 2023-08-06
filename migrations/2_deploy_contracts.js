const Quinn = artifacts.require('Quinn');

const common = require('../const');

module.exports = (deployer) => {
    deployer.deploy(Quinn, common.TOTAL_SUPPLY);
}