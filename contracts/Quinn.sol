// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

contract Quinn {
    string public name = "Quinn";
    string public symbol = "QNN";
    string public standard = "QNN v1.0";

    uint256 public totalSupply;

    // transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply; // 1 million
        balanceOf[msg.sender] = _initialSupply;
    }

    //transfer
    //Exception if account does not have enough
    //return a boolen
    //transfer event
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // trigger the transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
