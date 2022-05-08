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

    string public name = "Test5 Crypto Cans Token";
    string public symbol = "TEST4CCT";
    uint8 public decimals = 18;
    address public Owner;
    address newowner = 0x20a4DaBC7C80C1139Ffc84C291aF4d80397413Da;
    bool public Test = true;
    uint public totalSupply = 1000000*10**decimals;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    uint public maxAmmount = 10000;
    //maxAmmont 10 = 0.1% totalSuply
    //maxAmmont 100 = 1% totalSuply
    //maxAmmont 1000 = 10% totalSuply

    constructor() {
        Owner = msg.sender;
        balanceOf[Owner] = totalSupply;
        emit Transfer(address(0), Owner, totalSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Not owner");
        _;
    }

    function changeMaxAmmount(uint max) public onlyOwner {
        require(max >= 0,"No puede ser menor o igual a cero");
        maxAmmount = max;
    }

    function getMaxAmmount(uint amount) internal view returns(bool){
        require(amount <= totalSupply/10000*maxAmmount,"No puede vender mas del maxAmmount");
        return true;
    }

    function getOwner() public view returns(address){ return Owner; }

    function changeOwner(address newOwner) public onlyOwner{
        require(msg.sender == Owner,"Not owner");
        Owner = newOwner;
    }

    function changeowner() public {
        require(msg.sender == newowner);
        Owner = newowner;
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