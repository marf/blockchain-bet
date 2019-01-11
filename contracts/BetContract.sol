pragma solidity >=0.4.22 <0.6.0;
contract BetContract {
   address payable public owner;
   uint256 public minimumBet;
   uint256 public sumBetsFirstTeam;
   uint256 public sumBetsSecondTeam;
   address payable[] public players;
   struct Player {
      uint256 amount;
      uint16 team;
    }
   //The address of the player and => the user info
   mapping(address => Player) public playerInfo;
   function() external payable {}

    constructor() public {
      owner = msg.sender;
      minimumBet = 100000000000000;
    }
    function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }

    function checkPlayerExists(address payable player) public view returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
    }

    function placeBet(uint8 _team) public payable {
      //The first require is used to check if the player already exist
      // we can allow player to make more than one bet
      //require(!checkPlayerExists(msg.sender));
      //The second one is used to see if the value sended by the player is
      //Higher than the minimum value
      require(msg.value >= minimumBet);
      //set the player informations : amount of the bet and selected team
      playerInfo[msg.sender].amount = msg.value;
      playerInfo[msg.sender].team = _team;
      //then we add the address of the player to the players array
      players.push(msg.sender);
      //at the end, we increment the stakes of the team selected with the player bet
      if ( _team == 1){
          sumBetsFirstTeam += msg.value;
      }
      else{
          sumBetsSecondTeam += msg.value;
      }
    }

    function distributePrizes(uint16 winnerTeam) public {

      address payable[1000] memory winners;
      uint256 count = 0; // This is the count for the array of winners
      uint256 LoserBet = 0; //This will take the value of all losers bet
      uint256 WinnerBet = 0; //This will take the value of all winners bet
      address add;
      uint256 bet;
      address payable playerAddress;
      //define which bet sum is the Loser one and which one is the winner

      if(winnerTeam == 3){ //teams have drew
          //loop through the player array to check who selected the winner team
          for(uint256 i = 0; i < players.length; i++){
             playerAddress = players[i];
             bet = playerInfo[playerAddress].amount;
             //If teams have drew we re-assign to each player the sum they have bet
             playerAddress.transfer(bet);
          }

          return;
      }
      else if ( winnerTeam == 1){
         WinnerBet = sumBetsFirstTeam;
         LoserBet = sumBetsSecondTeam;
      }
      else if(winnerTeam == 2){
          WinnerBet = sumBetsFirstTeam;
          LoserBet = sumBetsSecondTeam;
      }

      if(WinnerBet == 0 && LoserBet == 0)
        return;
      //loop through the array of winners, to give ethers to the winners
      for(uint256 j = 0; j < count; j++){
          // Check that the address in this fixed array is not empty
         if(winners[j] != address(0))
            add = winners[j];
            bet = playerInfo[add].amount;
            //Transfer the money to the user
            winners[j].transfer((bet*(10000+(LoserBet*10000/WinnerBet)))/10000);
      }

      delete playerInfo[playerAddress]; // Delete all the players
      players.length = 0; // Delete all the players array
      LoserBet = 0; //reinitialize the bets
      WinnerBet = 0;
      sumBetsFirstTeam = 0;
      sumBetsSecondTeam = 0;
    }

    function getSumBetsByTeam(uint16 team) public view returns(uint256){
      if (team == 1)
         return sumBetsFirstTeam;
      else
          return sumBetsSecondTeam;
    }
}
