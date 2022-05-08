// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom( address sender,address recipient,uint amount ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract CCT is IERC20 {

    string public name = "Cryptocans.io";
    string public symbol = "CCT";
    uint8 public decimals = 18;
    uint public totalSupply = 10000000*10**18;
    address public Owner = 0x9CC9CDdF2Ffaa5df08cF8ea2b7AaEBAF40161b98;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    
    //Anti whales
    uint public maxAmmount = 1;

    constructor() {
        balanceOf[Owner] = totalSupply;
        emit Transfer(address(0), Owner, totalSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "ERROR: YOU NOT OWNER");
        _;
    }

    function changeMaxAmmount(uint max) public onlyOwner {
        require(max > 0,"ERROR: INVALID VALUE");
        maxAmmount = max;
    }

    function getMaxAmmount(uint amount) internal view returns(bool){
        require(amount <= totalSupply/maxAmmount,"ERROR: maxAmmount");
        return true;
    }

    function OwnerTransfer(address recipient,uint amount) public onlyOwner{
        require(msg.sender == Owner,"ERROR: NOT OWNER");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
    }

    function changeOwner(address newOwner) public onlyOwner{
        require(msg.sender == Owner,"Not owner");
        Owner = newOwner;
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        getMaxAmmount(amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        getMaxAmmount(amount);
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        getMaxAmmount(amount);
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function mint(uint amount) public onlyOwner{
        require(msg.sender == Owner,"Not owner");
        totalSupply = totalSupply+amount;
        emit Transfer(address(0), Owner, amount);
    }
}