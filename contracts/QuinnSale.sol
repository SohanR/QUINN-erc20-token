// SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.19;

import "./Quinn.sol";

contract QuinnSale {
    // DO NOT expose the address of admin
    address public admin;
    Quinn public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(Quinn _tokenContract, uint256 _tokenPrice) {
        // Assign an admin
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

    // Buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        // require that value is equal to tokens
        require(
            msg.value == _numberOfTokens * tokenPrice,
            "value is not equal to tokens"
        );
        // require that the contract has enough tokens
        require(
            tokenContract.balanceOf(admin) >= _numberOfTokens,
            "balance is not equal to"
        );
        // msg.sender here is the buyer
        // in transfer function, msg.sender is QuinnSale contract
        require(
            tokenContract.transfer(msg.sender, _numberOfTokens),
            "transfer issue"
        );

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function withdrawEther(address _recipient) public {
        require(msg.sender == admin, "Only owner can withdraw");
        payable(_recipient).transfer(address(this).balance);
    }
}
