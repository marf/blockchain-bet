import getWeb3 from '../utils/getWeb3.js';
import BetContract from '../contracts/BetContract.json';

let Betting = {

  initializeContract: async function(callback) {
    try {
      Betting.web3 = await getWeb3();

      Betting.accounts = Betting.web3.eth.accounts;

      const BetContractWeb3 = Betting.web3.eth.contract(BetContract.abi);

      Betting.contract = BetContractWeb3.at("0x8e415166b1162a31a9b0b38b42f7fe1ba98c17f4");

      Betting.currentTransactions = [];

      Betting.currentAccount = Betting.accounts[0];

      callback({status: true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      /*alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );*/
      console.log(error);
      callback({status: false});
    }
  },

  checkTransactionDone : function(tx, callback){
    Betting.currentTransactions.push(tx);

    let filter = Betting.web3.eth.filter("latest",function(error, blockHash) {
      if (!error) {
        Betting.web3.eth.getBlock(blockHash, function(error, result){
           if(!error)
           {
             let block = result;
             if (block.transactions.length > 0) {
                 console.log("found " + block.transactions.length + " transactions in block " + blockHash);
                 //console.log(JSON.stringify(block.transactions));
                 for(let i = 0; i < block.transactions.length; i++){
                    if(Betting.currentTransactions.indexOf(block.transactions[i]) !== -1){
                      console.log("Tx found: "+block.transactions[i]+" in block:"+blockHash);
                      Betting.currentTransactions.splice(block.transactions[i], 1);
                      filter.stopWatching();
                      callback({status: true});
                    }
                 }

             } else {
                 console.log("no transaction in block: " + blockHash);
             }
           }
           else
               console.error(error);
        })
      }
    });
  },

  setCurrentTransactions: function(tx){
    Betting.currentTransactions.push(tx);
  },

  setCurrentAccount: function(index){
    Betting.currentAccount = Betting.accounts[index];
  }

}

export default Betting;
