const CardAuthenticator = artifacts.require("CardAuthenticator");

module.exports = function (deployer) {
  deployer.deploy(CardAuthenticator);
};
