pragma solidity ^0.4.17; //version of solidity

contract Lottery{
    address public manager;
    address[] public player;
    
    constructor() public{
        manager = msg.sender;
    }
    
    // a function that makes you enter a lottery and checks if you have enough ether
    // if not it kicks you out of the function
    // we use requre to make sure the either are subructed
    
    
    function enter() public payable{
        require(msg.value > 0.01 ether);
        
        player.push(msg.sender);
        
    }
    //phesdo random generator
    // sha3 depriciated thats why am using  keccak256
    
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, player));
    }
    
    function pickWinner() public restricted{
        // to validate that the manager is the only one capable of creating 
        // we need to use require
        

        //takes the random function above and finds the modulas
        uint index = random() % player.length; 
        // picks a winner and sends all the ether in the contract
        // this is an instance of the contract
        // transfer is a globle variable 
        // balance is a globle variable
        
        player[index].transfer(this.balance);
        
        // our contact so far after picking a winner it doesnt 
        // empty or restart a game
        // the function below makes sure when a winner is choosen
        // the player array is empted
        
        player = new address[](0);
    }
    
    // in case we want to restrict many functions we might endup repeating
    // our code thats why we use modifier
    
    modifier restricted() {
        require(msg.sender == manager);
        _;

        
    }
    
    // a function that gets all the players
    
    function getPlayers() public view returns(address[]){
        return player;
    }
  
}
