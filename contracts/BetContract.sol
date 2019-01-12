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
      minimumBet = 100000000000000;  // 0.0001 ETH
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

    function placeBet(uint8 team) public payable {

      require(team == 1 || team == 2);

      require(msg.value >= minimumBet);

      playerInfo[msg.sender].amount = msg.value;
      playerInfo[msg.sender].team = team;

      players.push(msg.sender);

      if (team == 1){
          sumBetsFirstTeam += msg.value;
      }
      else{
          sumBetsSecondTeam += msg.value;
      }
    }

    function distributePrizes(uint16 winnerTeam) public {

      require(winnerTeam == 1 || winnerTeam == 2 || winnerTeam == 3);

      address payable[1000] memory winners;
      uint256 count = 0;
      uint256 LoserBet = 0;
      uint256 WinnerBet = 0;
      address add;
      uint256 bet;
      address payable playerAddress;

      if(winnerTeam == 3){ //teams have drew
          for(uint256 i = 0; i < players.length; i++){
             playerAddress = players[i];
             bet = playerInfo[playerAddress].amount;
             //If teams have drew we re-assign to each player the sum they have bet
             playerAddress.transfer(bet);
          }

          delete playerInfo[playerAddress];
          players.length = 0;
          LoserBet = 0;
          WinnerBet = 0;
          sumBetsFirstTeam = 0;
          sumBetsSecondTeam = 0;

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

      if(WinnerBet == 0)
        return;

      for(uint256 i = 0; i < players.length; i++){
        playerAddress = players[i];

        if(playerInfo[playerAddress].team == winnerTeam){
          winners[count] = playerAddress;
          count++;
        }
      }


      for(uint256 j = 0; j < count; j++){

         if(winners[j] != address(0))
            add = winners[j];
            bet = playerInfo[add].amount;
            //Transfer the money to the user
            winners[j].transfer((bet + (LoserBet*bet/WinnerBet)));
      }

      delete playerInfo[playerAddress];
      players.length = 0;
      LoserBet = 0;
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
