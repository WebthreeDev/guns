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
    bool public pause = false;
    address public contractOwner;

    constructor () {
        c = CCT(0xc3b7C04b1c5dBf7FD36Ff5E573AaA1E82130Cc47);
        contractOwner  = 0x20a4DaBC7C80C1139Ffc84C291aF4d80397413Da;
    }

    modifier Pause(){
        require(pause == false,"Contract Paused");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not owner");
        _;
    }

    function changePause() public onlyOwner returns(bool){
        if(pause == false){
            pause = true;
        }else{
            pause = false;
        }
        return pause;
    }

    function approveCaller(address spender, uint amount) external onlyOwner Pause returns (bool) {
        return c.approve(spender,amount);
    }

    function transferCaller(address recipient, uint amount) external onlyOwner Pause returns (bool) {
        return c.transfer(recipient,amount);
    }

    function transferFromCaller( address sender, address recipient, uint amount ) external onlyOwner Pause returns (bool) {
        return c.transferFrom(sender,recipient,amount);
    }

    function burnCaller(uint amount) external onlyOwner Pause {
        c.burn(amount);
    }

    function allowanceCaller(address owner, address spender) external view Pause returns (uint){
        return c.allowance(owner,spender);
    }

}