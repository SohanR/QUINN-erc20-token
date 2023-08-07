// SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.19;

contract Quinn {
    string public name = "Quinn";
    string public symbol = "QNN";
    string public standard = "QNN v1.0";

    uint256 public totalSupply;

    // transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // approve event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

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

    //delegated transfer

    // approve transfer
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        // allowance
        allowance[msg.sender][_spender] = _value;
        // approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transfer from
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // require _from has enough tokens
        require(_value <= balanceOf[_from]);

        // require  allowance is big enough
        require(_value <= allowance[_from][msg.sender]);

        // transfer event
        emit Transfer(_from, _to, _value);

        // change the balanceOf address
        balanceOf[_from] -= _value;

        // update the balanceOf address
        balanceOf[_to] += _value;

        // update the allowance of address
        allowance[_from][msg.sender] -= _value;

        return true;
    }
}
