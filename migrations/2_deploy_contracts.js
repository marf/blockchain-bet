let Migrations = artifacts.require("./Migrations.sol");
let BetContract = artifacts.require("./BetContract.sol");


module.exports = function(deployer) {
  deployer.deploy(BetContract)
  .then(() => BetContract.deployed())
    .then(_instance => console.log(_instance.address));
};
