// SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.19;

import "./Quinn.sol";

contract QuinnSale {
    address admin;
    Quinn public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    //sell event
    event Sell(address _buyer, uint256 _amount);

    //token contract
    //token price

    constructor(Quinn _tokenContract, uint256 _tokenPrice) {
        //assign an admin
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // mulitply
    //pure means not create transactions, not read or write data to blockchain
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        // ensuring that after multiplication, returned value is not getting overflowed.
        require(y == 0 || (z = x * y) / y == x);
    }

    // buy coins
    function buyTokens(uint256 _numberOfTokens) public payable {
        //require that value is equal to coin
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        //require that contract has enough coin
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // require that  transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        //keep track number of coin sold
        tokensSold += _numberOfTokens;
        // trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }
}
