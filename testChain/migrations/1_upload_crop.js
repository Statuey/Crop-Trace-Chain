const UploadCrop = artifacts.require("./UploadCrop.sol");

module.exports = function (deployer) {
  deployer.deploy(UploadCrop);
};
