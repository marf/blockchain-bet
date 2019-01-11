import React, { Component } from 'react';
import Betting from '../services/Betting.js';

class Team extends Component {

  constructor(props){

    super();

    this.state={
      teamID: props.teamID,
      web3: null,
      amountBet: 0,
      inputAmount: 0,
      accounts: null,
      contract: null,
      weiConversion : 1000000000000000000
    }

    this.app = props.app;
  }

  componentDidMount = async () => {
    /*  try {
        const web3 = await getWeb3();

        const accounts = web3.eth.accounts;

        const BetContractWeb3 = web3.eth.contract(BetContract.abi);

        const instance = BetContractWeb3.at("0xfB4A557892BB13D9A375513e7bB9a4d671c8229E");
        this.setState({ web3, accounts, contract: instance }, this.getAmount);
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(error);
      }*/

      //this.getAmount();
  }

  getAmount = async () => {
   Betting.contract.getSumBetsByTeam(this.state.teamID, (error, result) => {
    if(!error)
    {
         this.setState({ amountBet: Betting.web3.fromWei(result.toNumber())});
    }
    else
        console.error(error);
    });
  }

  placeBet = async () => {

    Betting.contract.placeBet(this.state.teamID, { from: Betting.currentAccount, value: Betting.web3.toWei(this.state.inputAmount) }, (error, result) => {
      console.log(result);

      Betting.checkTransactionDone(result, (res) => {
        Betting.contract.getSumBetsByTeam(this.state.teamID, (error, result) => {
         if(!error)
         {
              this.setState({ amountBet: Betting.web3.fromWei(result.toNumber())});
              this.app.updateBalance();
         }
         else
             console.error(error);
         });
      });
    });
  }

  makeWin = async () => {

    Betting.contract.distributePrizes(this.state.teamID, { from: Betting.accounts[0] }, (error, result) => {
      console.log(result);

      Betting.checkTransactionDone(result, (res) => {
        Betting.web3.eth.getBalance(Betting.currentAccount, (error, result) => {
         this.app.updateBalance();
        });
      });
    });
  }

  onInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }


  render() {
    return(
      <div>
        <p>Amount bet: <b>{this.state.amountBet}</b> ETH</p>
        <input type="text" onChange={this.onInputChange} name="inputAmount" required pattern="[0-9]*[.,][0-9]*"/>
        <button onClick={this.placeBet}>Bet</button>

      <button onClick={this.makeWin}>Win</button>
      </div>
    )
  }

}

export default Team;
