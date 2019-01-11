import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Betting from './services/Betting.js';
import Team from './components/Team';

class App extends Component {

  constructor(){
    super();

    this.state={
      address: '',
      currentAccountIndex: 0,
    }
  }

  componentDidMount = async () => {

        Betting.initializeContract((res)=> {
          if(res.status){
            Betting.web3.eth.getBalance(Betting.currentAccount, (error, result) => {
             if(!error)
             {
               this.updateBalance();
             }
             else
                 console.error(error);
             });
          }
        });
  }

  updateBalance = () => {
    Betting.web3.eth.getBalance(Betting.currentAccount, (error, result) => {
     if(!error)
     {
       this.setState({
         address: Betting.currentAccount,
         balance: Betting.web3.fromWei(result.toNumber())
       });

       this.team1.getAmount();
       this.team2.getAmount();

     }
     else
         console.error(error);
     });
  }

  /*changeAccount = () => {
    let newAccountIndex = (this.state.currentAccountIndex + 1) % 2;
    this.setState({currentAccountIndex: newAccountIndex});
    Betting.setCurrentAccount(newAccountIndex);
    this.updateBalance();
  }*/

  render() {
    return (
      <div className="App">

        <div className="Background" />

        <div className="Container">
          <div className="AppLogo">
            <img src={logo} alt="logo" />
            <h1>Blockchain Bet</h1>
          </div>
          <div className="Content">
            <h2>Your balance is <b>{this.state.balance} ETH</b></h2>
            <h6>Your Wallet address is {this.state.address}</h6>
          </div>
          <div className="Teams">
            <Team ref={(ref) => {this.team1 = ref}} teamID={1} app={this} />
            <Team ref={(ref) => {this.team2 = ref}} teamID={2} app={this} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
