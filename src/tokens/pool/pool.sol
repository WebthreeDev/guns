// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CCT {
     function getOwner() public view returns(address){}
     function approve(address spender, uint amount) external returns (bool) {}
     function transfer(address recipient, uint amount) external returns (bool) {}
     function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {}
    function burn(uint amount) external {}

    function allowance(address owner, address spender) external view returns (uint){}
}

contract CCTCALLER {
    CCT c;
    address contractOwner;
    constructor () {
        c = CCT(0x2F7cEe8Ee2Df75535d8368996e221F9dAB7b0dE8);
        contractOwner  = 0x20a4DaBC7C80C1139Ffc84C291aF4d80397413Da;
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not owner");
        _;
    }

    function approveCaller(address spender, uint amount) external onlyOwner returns (bool) {
        return c.approve(spender,amount);
    }

    function transferCaller(address recipient, uint amount) external onlyOwner returns (bool) {
        return c.transfer(recipient,amount);
    }

    function transferFromCaller( address sender, address recipient, uint amount ) external onlyOwner returns (bool) {
        return c.transferFrom(sender,recipient,amount);
    }

    function burnCaller(uint amount) external onlyOwner {
        c.burn(amount);
    }

    function allowanceCaller(address owner, address spender) external view returns (uint){
        return c.allowance(owner,spender);
    }

}