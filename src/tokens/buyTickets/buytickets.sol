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
    uint public ticketPrice = 10;

    constructor () {
        c = CCT(0x2529B65f1250812f0c20693656cED9b7Bb3beA56);
        contractOwner  = msg.sender;
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
        pause = !pause;
        return pause;
    }

    function changeTicketPrice(uint amount) public onlyOwner returns(bool){
        require(amount > 0,"ERROR: invalid amount!");
        ticketPrice = amount;
        return true;
    }

    function buyTicket(uint cant) public Pause returns(bool){
        return c.transferFrom(msg.sender,contractOwner,cant*ticketPrice*10**18); 
    }

}