// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CCT {
     function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {}
}

contract BUYTICKETS {
    
    CCT c;
    bool public pause = false;
    address public contractOwner;
    uint public ticketPrice = 1;

    constructor () {
        c = CCT(0xe38d2c817f9e6104d0372922740064d3ce8eceC6);
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

    function changeTicketPrice(uint ammount) public onlyOwner Pause returns(bool){
        require(ammount > 0,"No puede veler 0 o menos que 0!");
        ticketPrice = ammount;
        return true;
    }

    function buyTicket(uint cant) public Pause returns(bool){
        return c.transferFrom(msg.sender,contractOwner,cant*ticketPrice*10**18); 
    }

}