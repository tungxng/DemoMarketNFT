const MyNFT = artifacts.require("MyNFT");
const TokenFactory = artifacts.require("TokenFactory");
const Marketplace = artifacts.require("Marketplace");
module.exports = function (deployer) {
  deployer.deploy(MyNFT);
  deployer.deploy(TokenFactory);
  // deployer.deploy(Marketplace, '0x1416b2250e3eFd61C09042bA5Ad1a0C205801443', '0x85b87Aaf9fb5Effc64d3007f532FF2f960106Eb9');

};
