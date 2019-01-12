import React, { Component } from 'react';
import Betting from '../services/Betting.js';
import './Team.css';

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
      this.app.setState({isLoading: true});
      Betting.checkTransactionDone(result, (res) => {
        this.app.setState({isLoading: false});
        Betting.contract.getSumBetsByTeam(this.state.teamID, (error, result) => {
         if(!error)
         {
              this.setState({ amountBet: Betting.web3.fromWei(result.toNumber()), inputAmount: 0});
              this.app.updateBalance();
         }
         else
             console.error(error);
         });
      });
    });
  }

  onInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }


  render() {
    return(
      <div className="Team">
        <div className="Main">
          <div className="Logo">
            <img src={this.props.logo} alt={"Team image"} />
          </div>
          <div className="Content">
            <h4>Team {this.props.teamID.toString()}</h4>
            <p><b>{this.state.amountBet}</b> ETH</p>
          </div>
        </div>
        <div className="Bet">
          <input type="number" min="0" placeholder="Bet amount.." onChange={this.onInputChange} value={this.state.inputAmount} name="inputAmount" required pattern="[0-9]*[.,][0-9]*"/>
          <button onClick={this.placeBet}>Bet</button>
        </div>
      </div>
    )
  }

}

export default Team;
