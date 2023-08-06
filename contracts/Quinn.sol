// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

contract Quinn {
    string public name = "Quinn";
    string public symbol = "QNN";
    string public standard = "QNN v1.0";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply; // 1 million
        balanceOf[msg.sender] = _initialSupply;
    }
}
