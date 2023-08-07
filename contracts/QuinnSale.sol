// SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.19;

import "./Quinn.sol";

contract QuinnSale {
    address admin;
    Quinn public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    //token contract
    //token price

    constructor(Quinn _tokenContract, uint256 _tokenPrice) {
        //assign an admin
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}
