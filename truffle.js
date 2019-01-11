let WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

let ropstenPrivateKey = new Buffer("AAA5FC553F9EB75BB6A3300265336D8149A217FAE64E3508F70754C54B815424","hex");
let ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
let ropstenProvider = new WalletProvider(ropstenWallet, "https://ropsten.infura.io/v3/2590c49043d149b297ec6218911f2977");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: ropstenProvider,
      gas: 4600000,
      network_id: 3
    }
  }
};
