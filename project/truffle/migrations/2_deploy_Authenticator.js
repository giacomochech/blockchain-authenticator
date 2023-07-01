const Authenticator = artifacts.require("Authenticator");

module.exports = function (deployer) {
  deployer.deploy(Authenticator);
};